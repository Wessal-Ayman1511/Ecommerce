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
import { Public, Roles, User } from 'src/common/decorators';
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

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) categId: Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User('id') userId: Types.ObjectId,
  ) {
    return this.categoryService.update(categId, updateCategoryDto, userId);
  }

  @Patch(':id/image')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id', ParseObjectIdPipe) categId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId: Types.ObjectId,
  ) {
    return this.categoryService.updateImage(categId, file, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id') categId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.remove(categId, userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseObjectIdPipe) categId: Types.ObjectId) {
    return this.categoryService.findOne(categId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  
}
