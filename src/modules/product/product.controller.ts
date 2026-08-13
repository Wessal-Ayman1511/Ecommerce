import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { Roles, User } from 'src/common/decorators';
import { Role } from 'src/DB/enums/user.enum';
import { Types } from 'mongoose';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { RequiredthumbnailPipe } from './pipes/require-thumbnail.pipe';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { request } from 'express';
import { CreateProductDto, RemoveImageDto, UpdateProductDto } from './dto';
import { Image } from 'src/common/types';
import { MAX_IMAGES_FOR_PRODUCT } from 'src/common/constants';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':categId')
  @Roles(Role.SELLER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: MAX_IMAGES_FOR_PRODUCT },
    ]),
  )
  create(
    @User('_id') userId: Types.ObjectId,
    @Param('categId', ParseObjectIdPipe) categId: Types.ObjectId,
    @UploadedFiles(RequiredthumbnailPipe) //
    files: Record<string, Express.Multer.File[]>,
    @Body() data: CreateProductDto,
  ) {
    return this.productService.create(userId, categId, files, data);
  }

  @Patch(':productId')
  @Roles(Role.SELLER)
  update(
    @User('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(userId, productId, data);
  }

  @Patch(':productId/remove-image')
  @Roles(Role.SELLER)
  remove_image(
    @User('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() data: RemoveImageDto,
  ) {
    return this.productService.remove_image(userId, productId, data.secure_url);
  }

  @Post(':productId/add-image')
  @Roles(Role.SELLER)
  @UseInterceptors(FileInterceptor('image'))
  add_image(
    @User('_id') userId: Types.ObjectId,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Query('isThumbnail', ParseBoolPipe) isThumbnail: boolean,
  ) {
    return this.productService.add_image(userId, productId, file, isThumbnail);
  }

  @Delete(':productId')
  @Roles(Role.ADMIN, Role.SELLER)
  remove(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    return this.productService.remove(productId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
}
