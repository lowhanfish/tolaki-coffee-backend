import { Controller, Body, Get, Post } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateOrderDto } from './dto/redis.dto';

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

  @Post('orders')
  @Public()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.redisService.createOrder(dto);
  }
}
