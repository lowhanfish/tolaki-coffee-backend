import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckProducts implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const body = req.body;

    const products = body.items;

    // kita mulai check 1 persatu stock existing di database berdasarkan productId
    const productId = products.map((item) => item.productId);
    const productWithStock = await this.prisma.product.findMany({
      where: {
        id: {
          in: productId,
        },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    const stockMap = new Map(productWithStock.map((p) => [p.id, p.stock]));
    const itemsWithStock = products.map((item) => ({
      ...item,
      stock: stockMap.get(item.productId) ?? 0,
    }));

    // console.log(itemsWithStock);

    body.items = itemsWithStock;

    // const product

    // kita mulai check data di redist berdasarkan productId yang masih status pending
    // kita akan mengurangi status stick di db dengan pesanan di redist
    // mapping ulang

    // console.log(body);
    return next.handle();
  }
}

// helpers
