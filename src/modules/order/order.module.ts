import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/DB/repositories';
import { OrderModel } from 'src/DB/models/order.model';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { PaymentModule } from 'src/common/payment/payment.module';
import { OrderResolver } from './order.resolver';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderResolver],
  imports: [OrderModel, CartModule, ProductModule, PaymentModule]
})
export class OrderModule {}
