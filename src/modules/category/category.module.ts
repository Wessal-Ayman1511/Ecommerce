import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CloudinaryProvider, FilteUploadService } from 'src/common/services/fileupload';
import { CategoryRepository } from 'src/DB/repositories';
import { CategoryModel } from 'src/DB/models';

@Module({
  imports: [CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService, FilteUploadService, CategoryRepository, CloudinaryProvider],
  exports: [CategoryRepository]
})
export class CategoryModule {}
