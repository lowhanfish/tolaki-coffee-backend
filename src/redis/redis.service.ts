import { Injectable, Inject, ConflictException } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';
import { CreateOrderDto } from './dto/redis.dto';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async ping(): Promise<string> {
    return this.redis.ping();
  }

  async createOrder(dto: CreateOrderDto) {
    const key = `order:${dto.orderId}`;

    const result = await this.redis.set(`${key}:lock`, '1', 'EX', 60, 'NX');

    if (result !== 'OK') {
      throw new ConflictException('Order sedang diproses');
    }

    try {
      await this.redis.hset(key, {
        orderId: dto.orderId,
        productId: dto.productId,
        quantity: dto.quantity.toString(),
        status: 'PENDING',
      });

      await this.redis.expire(key, 300);

      return {
        message: 'Order berhasil dibuat',
        orderId: dto.orderId,
        status: 'PENDING',
        ttl: 300,
      };
    } finally {
      await this.redis.del(`${key}:lock`);
    }
  }
}
