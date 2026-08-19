import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, Roles, User } from 'src/common/decorators';
import { type UserDocument } from 'src/DB/models';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/DB/enums/user.enum';

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

  @Post('/cancel/:id')
  @Roles(Role.USER)
  cancelOrder(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @User('_id') userId: Types.ObjectId
  ){
    return this.orderService.cancelOrder(id, userId)

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
