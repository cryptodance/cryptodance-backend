import { Module, CacheModule } from '@nestjs/common';
import { InmemoryCacheService } from './inmemory-cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      ttl: new ConfigService().get('REDIS_TTL'),
    }),
  ],
  providers: [InmemoryCacheService, ConfigService],
  exports: [InmemoryCacheService],
})
export class InmemoryCacheModule {}
