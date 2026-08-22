import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { PaginateRespone } from 'src/common/graphql/entities/paginate.entity';
import { OrderStatus, PaymendMethod } from 'src/DB/enums/order.enum';
import { OneUserResponse } from 'src/modules/user/entities/user.entity';


@ObjectType()
export class AllOrdersResponse extends PaginateRespone {
  @Field(() => [OneOrderResponse])
  data: OneOrderResponse[];
}



@ObjectType()
export class OneOrderResponse {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => OneUserResponse)
  user: OneUserResponse;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  orderStatus: OrderStatus;

  @Field(() => String)
  paymentMethod: PaymendMethod;

  @Field(() => Boolean)
  paid: boolean;
}
