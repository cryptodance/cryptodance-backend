import { Module, HttpModule } from '@nestjs/common';
import { OrderbooksController } from './orderbooks.controller';
import { OrderbooksService } from './orderbooks.service';
// import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { InmemoryCacheModule } from '../inmemory-cache/inmemory-cache.module';

@Module({
  imports: [HttpModule, InmemoryCacheModule],
  controllers: [OrderbooksController],
  providers: [OrderbooksService],
})
export class OrderbooksModule {}
