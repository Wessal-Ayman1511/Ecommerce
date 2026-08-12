// schema claass

import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModel, UserModelName } from './user.model';
import type { Image } from 'src/common/types';
import slugify from 'slugify';
import { FilteUploadService } from 'src/common/services/fileupload';
import { ConfigService } from '@nestjs/config';
import { FileUploadModule } from 'src/common/services/fileupload/file-upload.module';

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

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  image: Image;

  @Prop({ Type: String })
  cloudFolder: string;
}

// schema

export const CategorySchema = SchemaFactory.createForClass(Category);

// hook for slug
// CategorySchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name);
//   }
// });
// hook for deleting category from the cloud

// CategorySchema.post(
//   'deleteOne',
//   { document: true, query: false },
//   async function (doc) {
//     const categFolder = doc.cloudFolder;
//   },
// );

// model name
export const CategoryModelName = Category.name;
/// model
// export const CategoryModel = MongooseModule.forFeature([
//   { name: CategoryModelName, schema: CategorySchema },
// ]);

export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: CategoryModelName,
    useFactory: (
      configService: ConfigService,
      fileUploadService: FilteUploadService,
    ) => {
      // hook 1
      CategorySchema.pre('save', function (next) {
        if (this.isModified('name')) {
          this.slug = slugify(this.name);
        }
      });
      // hook 2
      CategorySchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc) {
          const categFolder = doc.cloudFolder;
          const rootFolder = configService.get("CLOUD_ROOT_FOLDER")
          const folderPath = `${rootFolder}/category/${categFolder}`
          await fileUploadService.deleteFolder(folderPath)
        },
      );

      return CategorySchema
    },
    inject: [ConfigService, FilteUploadService],
    imports: [FileUploadModule]
  },
]);

// Category type

export type CategoryDocument = HydratedDocument<Category>;
