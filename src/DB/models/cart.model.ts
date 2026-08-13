// schema claass

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { ProductModelName } from './product.model';

@Schema({ timestamps: true })
class Cart {
  @Prop({ type: Types.ObjectId, required: true, ref: UserModelName })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: Types.ObjectId,
          requird: true,
          ref: ProductModelName,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
  })
  products: { productId: Types.ObjectId; quantity: number; price: number }[];
}

// schema

export const CartSchema = SchemaFactory.createForClass(Cart);

// model name
export const CartModelName = Cart.name;
/// model
export const CartModel = MongooseModule.forFeature([
  { name: CartModelName, schema: CartSchema },
]);

// Cart type

export type CartDocument = HydratedDocument<Cart>;
