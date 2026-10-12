import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('ping')
  @Public()
  async ping() {
    const result = await this.redisService.ping();

    return {
      message: 'Redis connection successful',
      result,
    };
  }
}
