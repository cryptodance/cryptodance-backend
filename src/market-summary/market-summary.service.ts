import { Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { map } from 'rxjs/operators';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class MarketSummaryService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private httpService: HttpService,
  ) {}

  async getMarketSummaryByCurrencyPair(currencyPair: string): Promise<any> {
    let found;
    try {
      if (currencyPair == 'btc_eth') {
        found = await this.redisCacheService.get(
          currencyPair.toLowerCase() + '_summary',
        );
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
  async handleMarketSummary() {
    const bittrexUrl = 'https://api.bittrex.com/v3/markets/ETH-BTC/summary';
    const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';

    try {
      let bittrexMarketSummary = await this.httpService
        .get(bittrexUrl)
        .pipe(map(response => response.data))
        .toPromise();

      let bittrexMarketSummaryBTCETH = {
        exchange: 'bittrex',
        exchangeUrl: 'https://bittrex.com',
        symbol: 'BTC-ETH',
        high: bittrexMarketSummary['high'],
        low: bittrexMarketSummary['low'],
        volume: bittrexMarketSummary['quoteVolume'],
        percentChange: bittrexMarketSummary['percentChange'],
      };

      let poloniexMarketSummary = await this.httpService
        .get<any>(poloniexUrl)
        .pipe(map(response => response.data['BTC_ETH']))
        .toPromise();

      let poloniexMarketSummaryBTCETH = {
        exchange: 'poloniex',
        exchangeUrl: 'https://poloniex.com',
        symbol: 'BTC-ETH',
        high: poloniexMarketSummary['high24hr'],
        low: poloniexMarketSummary['low24hr'],
        volume: poloniexMarketSummary['baseVolume'],
        percentChange: (
          parseFloat(poloniexMarketSummary['percentChange']) * 100
        ).toFixed(2),
      };

      await this.redisCacheService.set('btc_eth_summary', [
        bittrexMarketSummaryBTCETH,
        poloniexMarketSummaryBTCETH,
      ]);
    } catch (error) {
      console.log('handleMarketSummary');
      console.log(error);
    }
  }
}
