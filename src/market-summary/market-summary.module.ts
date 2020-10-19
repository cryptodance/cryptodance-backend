import { Module, HttpModule } from '@nestjs/common';
import { MarketSummaryController } from './market-summary.controller';
import { MarketSummaryService } from './market-summary.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule, HttpModule],
  controllers: [MarketSummaryController],
  providers: [MarketSummaryService],
})
export class MarketSummaryModule {}
