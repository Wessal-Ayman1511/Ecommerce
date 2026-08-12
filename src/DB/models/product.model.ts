// schema claass

import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {  UserModelName } from './user.model';
import type { Image } from 'src/common/types';
import slugify from 'slugify';


@Schema({ timestamps: true })
class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'product_name_index' },
    set: function (this: Product, value: string) {
      this.slug = slugify(value)
      return value
    },
  })
  name: string;

  @Prop({ type: String, unique: true })
  slug: String;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  thumbnail: Image;

  @Prop([{ secure_url: String, public_id: String }])
  images: Image[];

  @Prop({ Type: String })
  cloudFolder: string;

  @Prop({ Type: Number, min: 1, required: true })
  stock: number;

  @Prop({
    Type: Number,
    required: true,
  })
  price: number;

  @Prop({
    Type: Number,
    required: true,
    min: 0,
    max: 100,
    set: function (this: Product, value: number) {
      this.finalPrice = this.price - (this.price * value) / 100;
      return value;
    },
  })
  discount: number;

  @Prop({ Type: Number, required: true, default: function(this: Product) {
    return this.price
  }})
  finalPrice: number;

  @Prop({ Type: Number, min: 0, max: 5 })
  rating: number;
}

// schema

export const ProductSchema = SchemaFactory.createForClass(Product);

// model name
export const ProductModelName = Product.name;
// model
export const ProductModel = MongooseModule.forFeature([
  { name: ProductModelName, schema: ProductSchema },
]);

// Product type

export type ProductDocument = HydratedDocument<Product>;
