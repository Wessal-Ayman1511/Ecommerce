import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AllOrdersResponse } from './entities/order.entity';
import { Public } from 'src/common/decorators';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}

  @Public()
  @Query(() => AllOrdersResponse)
  async getAllOrders() {
    return this._OrderService.AllOrders();
  }
}
