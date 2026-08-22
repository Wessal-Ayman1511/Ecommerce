import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { OrderStatus, PaymendMethod } from 'src/DB/enums/order.enum';
@ObjectType()
export class PaginateRespone {
  @Field(() => Int)
  totalSize: number;
  @Field(() => Int)
  totalPages: number;
  @Field(() => Int)
  pageSize: number;
  @Field(() => Int)
  pageNumber: number;
}

@ObjectType()
export class AllOrdersResponse extends PaginateRespone {
  @Field(() => [OneOrderResponse])
  data: OneOrderResponse[];
}

@ObjectType()
export class OneUserResponse {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
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
