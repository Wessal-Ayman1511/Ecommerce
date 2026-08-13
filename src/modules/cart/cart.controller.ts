import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Type,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartDto } from './dto/create-cart.dto';
import { Types } from 'mongoose';
import { Roles, User } from 'src/common/decorators';
import { Role } from 'src/DB/enums/user.enum';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles(Role.USER)
  addToCart(@Body() data: CartDto, @User('_id') userId: Types.ObjectId) {
    return this.cartService.addToCart(data, userId);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
