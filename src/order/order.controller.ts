import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  ReadOrderDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Public()
  create(@Body() dto: CreateOrderDto) {
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
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto.status);
  }
}
