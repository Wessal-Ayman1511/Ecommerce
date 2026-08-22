import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AllOrdersResponse } from './entities/order.entity';
import { Public } from 'src/common/decorators';
import { isGraphQL } from 'src/common/decorators/graphql-decorator';
import { skipInterceptor } from 'src/common/decorators/skip-interceptor.decorator';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}

  @Public()
  @isGraphQL()
  @skipInterceptor()
  @Query(() => AllOrdersResponse)
  async getAllOrders() {
    return this._OrderService.AllOrders();
  }
}
