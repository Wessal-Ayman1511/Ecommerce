import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CategoryRepository, ProductRepository } from 'src/DB/repositories';
import { NotFoundError } from 'rxjs';
import { FilteUploadService } from 'src/common/services/fileupload';
import { nanoid } from 'nanoid';
import { Image } from 'src/common/types';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(
    private readonly _CategoryRepository: CategoryRepository,
    private readonly _ProductRepository: ProductRepository,
    private readonly _ConfigService: ConfigService,
    private readonly _FilteUploadService: FilteUploadService,
  ) {}

  async create(
    userId: Types.ObjectId,
    categId: Types.ObjectId,
    files: Record<string, Express.Multer.File[]>,
    data: CreateProductDto,
    req: Request
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categId },
    });

    if (!category) throw new NotFoundException('Category Not Found!');

    const product = await this._ProductRepository.findOne({
      filter: { name: data.name },
    });
    if (product) throw new BadRequestException('Product already exist');

    // uplaod sumbnail, upload images, save to db
    const cloudFolder = `${this._ConfigService.get('CLOUD_ROOT_FOLDER')}/product/${nanoid()}`;

    const [thumbnail] = await this._FilteUploadService.saveFileToCloud(
      files.thumbnail,
      {
        folder: cloudFolder,
      },
    );

    let images: Image[] | undefined;
    if (files.images) {
      const images = await this._FilteUploadService.saveFileToCloud(
        files.images,
        {
          folder: cloudFolder,
        },
      );
      req['images'] = cloudFolder
    }

    const createdProduct = await this._ProductRepository.create({
      ...data,
      createdBy: userId,
      category: categId,
      cloudFolder,
      thumbnail,
      ...(images && { images }),
    });


    return { data: createdProduct, message: 'Product Created Successfully!' };
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
