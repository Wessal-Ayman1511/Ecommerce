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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles, User } from 'src/common/decorators';
import { Role } from 'src/DB/enums/user.enum';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequiredthumbnailPipe } from './pipes/require-thumbnail.pipe';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { request } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':categId')
  @Roles(Role.SELLER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  create(
    @User('_id') userId: Types.ObjectId,
    @Param('categId', ParseObjectIdPipe) categId: Types.ObjectId,
    @UploadedFiles(RequiredthumbnailPipe) //
    files: Record<string, Express.Multer.File[]>,
    @Body() data: CreateProductDto,
    @Req() req: any
  ) {
    return this.productService.create(userId, categId, files, data, req);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
