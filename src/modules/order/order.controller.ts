import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, User } from 'src/common/decorators';
import { type UserDocument } from 'src/DB/models';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() data: CreateOrderDto, @User() user: UserDocument) {
    return this.orderService.create(data, user);
  }

  @Post('/webhook')
  @Public()
  stripeWebhook(@Body() data: any) {
    this.orderService.stripeWebhook(data)
    return
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
