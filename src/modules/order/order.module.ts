import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/DB/repositories';
import { OrderModel } from 'src/DB/models/order.model';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  imports: [OrderModel, CartModule, ProductModule]
})
export class OrderModule {}
