import { Controller, Get, Param } from '@nestjs/common';
import { OrderbooksService } from './orderbooks.service';
import { CryptoDanceOrderbookInterface } from './interfaces/cryptoDanceOrderBook.interface';

@Controller('orderbooks')
export class OrderbooksController {
  constructor(private orderbooksService: OrderbooksService) {}

  @Get(':currencyPair')
  async getOrderBookByCurrencyPair(
    @Param('currencyPair') currencyPair: string,
  ): Promise<CryptoDanceOrderbookInterface> {
    return await this.orderbooksService.getOrderBookByCurrencyPair(
      currencyPair,
    );
  }
}
