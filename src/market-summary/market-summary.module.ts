import { Module, HttpModule } from '@nestjs/common';
import { MarketSummaryController } from './market-summary.controller';
import { MarketSummaryService } from './market-summary.service';
// import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { InmemoryCacheModule } from '../inmemory-cache/inmemory-cache.module';

@Module({
  imports: [HttpModule, InmemoryCacheModule],
  controllers: [MarketSummaryController],
  providers: [MarketSummaryService],
})
export class MarketSummaryModule {}
