import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';
import { ProductRepository } from 'src/DB/repositories';
import { ProductModel } from 'src/DB/models';
import { FileUploadModule } from 'src/common/services/fileupload/file-upload.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository], 
  imports: [CategoryModule, ProductModel, FileUploadModule],
  exports: [ProductService, ProductRepository]
})
export class ProductModule {}
