import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AllOrdersResponse } from './entities/order.entity';
import { Public, Roles } from 'src/common/decorators';
import { isGraphQL } from 'src/common/decorators/graphql-decorator';
import { skipInterceptor } from 'src/common/decorators/skip-interceptor.decorator';
import { User } from 'src/common/decorators/user-graphql.decorator';
import { Types } from 'mongoose';
import { Role } from 'src/DB/enums/user.enum';
import { PaginateInput } from 'src/common/graphql/inputs/paginate.input';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}

  @Roles(Role.USER)
  @isGraphQL()
  @skipInterceptor()
  @Query(() => AllOrdersResponse)
  async getAllOrders(
    @User('_id') userId: Types.ObjectId,
    @Args('paginate', {nullable: true}) paginate: PaginateInput
    
  ) {
    return this._OrderService.AllOrders(userId, paginate);
  }
}
