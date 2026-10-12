import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({
  controllers: [RedisController],
  providers: [redisProvider, RedisService],
  exports: [redisProvider],
})
export class RedisModule {}
