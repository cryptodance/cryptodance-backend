import { Controller, Get, Param } from '@nestjs/common';
import { MarketSummaryService } from './market-summary.service';

@Controller('marketsummary')
export class MarketSummaryController {
  constructor(private marketSummaryService: MarketSummaryService) {}

  @Get(':currencyPair')
  async getMarketSummaryByCurrencyPair(
    @Param('currencyPair') currencyPair: string,
  ): Promise<any> {
    return await this.marketSummaryService.getMarketSummaryByCurrencyPair(
      currencyPair,
    );
  }
}
