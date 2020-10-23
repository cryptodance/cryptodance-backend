import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbooksModule } from './orderbooks/orderbooks.module';
// import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketSummaryModule } from './market-summary/market-summary.module';
import { InmemoryCacheModule } from './inmemory-cache/inmemory-cache.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    OrderbooksModule,
    MarketSummaryModule,
    InmemoryCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
