import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { FilteUploadService } from 'src/common/services/fileupload';
import { CategoryRepository } from 'src/DB/repositories';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _FileUploadService: FilteUploadService,
    private readonly _ConfigService: ConfigService,
    private readonly _CategoryRepository: CategoryRepository,
  ) {}
  async create(
    data: CreateCategoryDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    // upload to cloud then save in the db
    const cloudFolder = `${this._ConfigService.get('CLOUD_ROOT_FOLDER')}/category/${nanoid()}`;

    const results = await this._FileUploadService.saveFileToCloud([file], {
      folder: cloudFolder,
    });

    const category = await this._CategoryRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      cloudFolder,
    });
    return { data: category };
  }

  async update(
    categId: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
    userId: Types.ObjectId,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categId },
    });

    if (!category) throw new NotFoundException('category not found!');

    if (updateCategoryDto.name) {
      ((category.name = updateCategoryDto.name), (category.updatedBy = userId));
      await category.save();
    }

    return { data: category };
  }

  async updateImage(
    categId: Types.ObjectId,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categId },
    });

    if (!category) throw new NotFoundException('category not found!');

    const public_id = category.image.public_id;

    // update in cloud
    const results = await this._FileUploadService.saveFileToCloud([file], {
      public_id,
    });

    // update in the db
    category.image = results[0];
    category.updatedBy = userId;
    await category.save();

    return { data: category };
  }

  async remove(categId: Types.ObjectId, userId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categId },
    });

    if (!category) throw new NotFoundException('category not found!');

    await category.deleteOne();
    return { message: 'category deleted successfully!' };
  }

  async findOne(categId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categId },
    });

    if (!category) throw new NotFoundException('category not found!');

    return { data: category };
  }

  async findAll(page: number) {
    return {
      data: await this._CategoryRepository.findAll({
        populate: [{ path: 'createdBy' }],
        paginate: {page}
      }),
    };
  }
}
