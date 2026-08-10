// schema claass

import { MongooseModule, Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModel, UserModelName } from './user.model';
import type { Image } from 'src/common/types';
import slugify from 'slugify';

@Schema({ timestamps: true })
class Category {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: { name: 'category_name_index' },
  })
  name: string;

  @Prop({ type: String, unique: true })
  slug: String;

  @Prop({type: Types.ObjectId, ref: UserModelName, required: true})
  createdBy: Types.ObjectId

  @Prop(raw({secure_url: String, public_id: String}))
  image: Image

  @Prop({Type: String})
  cloudFolder: string

  
}

// schema

export const CategorySchema = SchemaFactory.createForClass(Category);

// hook
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name)
  }
});

// model name
export const CategoryModelName = Category.name;
/// model
export const CategoryModel = MongooseModule.forFeature([
  { name: CategoryModelName, schema: CategorySchema },
]);

// Category type

export type CategoryDocument = HydratedDocument<Category>;
