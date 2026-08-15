// schema claass

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { ProductModelName } from './product.model';
import { CartModelName } from './cart.model';
import { OrderStatus, PaymendMethod } from '../enums/order.enum';
import { type Image } from 'src/common/types';

@Schema({ timestamps: true })
class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: UserModelName })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: CartModelName })
  cart: Types.ObjectId;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({type: Number, required: true})
  price: number

  
  @Prop({ type: String, default: OrderStatus.placed })
  orderStatus: OrderStatus;

  @Prop({type: String, default: PaymendMethod.cash})
  paymentMethod: PaymendMethod


  @Prop({type: Boolean, default: false})
  paid: boolean

  @Prop({type: {secure_url: String, public_id: String}})
  invoice: Image


  @Prop({type: String})
  payment_intent: string
}

// schema
export const OrderSchema = SchemaFactory.createForClass(Order);

// model name
export const OrderModelName = Order.name;

/// model
export const OrderModel = MongooseModule.forFeature([
  { name: OrderModelName, schema: OrderSchema },
]);

// Order type
export type OrderDocument = HydratedDocument<Order>;
