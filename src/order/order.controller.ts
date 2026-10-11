import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  ReadOrderDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { Public } from '../common/decorators/public.decorator';
import { CheckProducts } from 'src/common/interceptors/check-products.interceptor';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Di sinilah tempat pesanan di buat. pastikan raja ongkir di pasang di sini
  // sebaiknya jadikan interceptor atau decorator

  @Post('create')
  @Public()
  @UseInterceptors(CheckProducts)
  create(@Body() dto: CreateOrderDto) {
    console.log(dto);
    return this.orderService.create(dto);
  }

  @Get('dashboard-summary')
  getDashboardSummary() {
    return this.orderService.getDashboardSummary();
  }

  @Get('read')
  findAll(@Query() query: ReadOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get('readOne/:id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch('update-status/:id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto.status);
  }
}
