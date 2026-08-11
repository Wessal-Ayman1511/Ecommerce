import { Injectable } from '@nestjs/common';
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
    const rootFolder = this._ConfigService.get('CLOUD_ROOT_FOLDER');
    const cloudFolder = nanoid();

    const results = await this._FileUploadService.saveFileToCloud(
      [file],
      `${rootFolder}/${data.name}/${cloudFolder}`,
    );

    const category = await this._CategoryRepository.create({
      name: data.name,
      image: results[0],
      createdBy: userId,
      cloudFolder

    })
    return {data: category}
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
