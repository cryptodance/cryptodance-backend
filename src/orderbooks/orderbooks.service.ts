import { Injectable, NotFoundException, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { map } from 'rxjs/operators';

import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { CryptoDanceOrderInterface } from './interfaces/cryptoDanceOrder.interface';
import { CryptoDanceOrderbookInterface } from './interfaces/cryptoDanceOrderBook.interface';

@Injectable()
export class OrderbooksService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private httpService: HttpService,
  ) {}

  async getOrderBookByCurrencyPair(
    currencyPair: string,
  ): Promise<CryptoDanceOrderbookInterface> {
    let found;
    try {
      if (currencyPair == 'btc_eth') {
        found = await this.redisCacheService.get(currencyPair);
      } else {
        found = null;
      }
    } catch (error) {
      throw new NotFoundException(
        `Currency pair with ${currencyPair} not found`,
      );
    }

    if (!found) {
      throw new NotFoundException(
        `Currency pair with ${currencyPair} not found`,
      );
    }

    return found;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCombinedOrderBooks() {
    try {
      const bittrexUrl =
        'https://api.bittrex.com/v3/markets/ETH-BTC/orderbook?depth=500';

      const poloniexUrl =
        'https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=100';

      let bittrexOrderBook = await this.httpService
        .get(bittrexUrl)
        .pipe(map(response => response.data))
        .toPromise();

      let bittrexBids = this.transformThirdParyOrderBookToCryptoDanceOrderBook(
        bittrexOrderBook['bid'],
        'bittrex',
      );

      let bittrexAsks = this.transformThirdParyOrderBookToCryptoDanceOrderBook(
        bittrexOrderBook['ask'],
        'bittrex',
      );

      let poloniexOrderBook = await this.httpService
        .get<any>(poloniexUrl)
        .pipe(map(response => response.data))
        .toPromise();

      let poloniexBids = this.transformThirdParyOrderBookToCryptoDanceOrderBook(
        poloniexOrderBook['bids'],
        'poloniex',
      );

      let poloniexAsks = this.transformThirdParyOrderBookToCryptoDanceOrderBook(
        poloniexOrderBook['asks'],
        'poloniex',
      );

      let combinedBids = this.combineOrderBooks(bittrexBids, poloniexBids);
      let combinedAsks = this.combineOrderBooks(
        bittrexAsks,
        poloniexAsks,
        'ascending',
      );

      await this.redisCacheService.set('btc_eth', {
        bids: combinedBids,
        asks: combinedAsks,
      });
    } catch (error) {
      console.log('handleCombinedOrderBooks');
      console.log(error);
    }
  }

  transformThirdParyOrderBookToCryptoDanceOrderBook(
    orders: Array<any>,
    exchange: string,
  ): Array<CryptoDanceOrderInterface> {
    let newOrders = [];

    if (exchange == 'bittrex') {
      newOrders = orders.map(order => {
        let rate = parseFloat(order['rate']);
        let quantity = parseFloat(order['quantity']);
        let total = parseFloat((rate * quantity).toFixed(4));
        let exchanges = [exchange];
        return { rate, quantity, total, exchanges };
      });
    } else {
      newOrders = orders.map(order => {
        let rate = parseFloat(order[0]);
        let quantity = order[1];
        let total = parseFloat((rate * quantity).toFixed(4));
        let exchanges = [exchange];
        return { rate, quantity, total, exchanges };
      });
    }

    return newOrders.reduce((orders, order, index) => {
      let aggtotal =
        index > 0 ? orders[index - 1].aggtotal + order.total : order.total;
      aggtotal = parseFloat(aggtotal).toFixed(8);
      orders.push({ ...order, aggtotal });
      return orders;
    }, []);
  }

  combineOrderBooks(
    a: Array<CryptoDanceOrderInterface>,
    b: Array<CryptoDanceOrderInterface>,
    sortType: string = 'descending',
  ): Array<CryptoDanceOrderInterface> {
    let combinedOrderBook = new Map();
    a.forEach(order => {
      combinedOrderBook.set(order.rate, order);
    });
    b.forEach(order => {
      combinedOrderBook.set(order.rate, order);
    });
    return [...combinedOrderBook.values()];
  }
}
