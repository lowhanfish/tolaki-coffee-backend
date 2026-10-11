import { Controller, Post, Get, UseInterceptors, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CheckProducts } from 'src/common/interceptors/check-products.interceptor';
import { ReadPayment } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  @Public()
  @UseInterceptors(CheckProducts)
  webhook(@Body() body: ReadPayment) {
    return {
      status: 200,
      message: body,
    };
  }
}
