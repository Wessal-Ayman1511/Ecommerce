import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/DB/repositories';
import { CartModel } from 'src/DB/models';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  imports: [CartModel, ProductModule],
  exports: [CartRepository, CartService]
})
export class CartModule {}
