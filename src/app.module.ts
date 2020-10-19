import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbooksModule } from './orderbooks/orderbooks.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketSummaryModule } from './market-summary/market-summary.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    OrderbooksModule,
    RedisCacheModule,
    MarketSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
