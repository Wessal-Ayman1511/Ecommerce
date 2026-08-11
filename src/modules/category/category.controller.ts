import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles, User } from 'src/common/decorators';
import { Role } from 'src/DB/enums/user.enum';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: CreateCategoryDto,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.create(data, userId, file);
  }

  @Patch(':categId')
  @Roles(Role.ADMIN)
  update(
    @Param('categId', ParseObjectIdPipe) categId: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User('id') userId: Types.ObjectId,
  ) {
    return this.categoryService.update(categId, updateCategoryDto, userId);
  }

  @Patch(':categId/image')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('categId', ParseObjectIdPipe) categId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId: Types.ObjectId,
  ) {
    return this.categoryService.updateImage(categId, file, userId);
  }

  @Delete(':categId')
  @Roles(Role.ADMIN)
  remove(
    @Param('categId') categId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.remove(categId, userId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
}
