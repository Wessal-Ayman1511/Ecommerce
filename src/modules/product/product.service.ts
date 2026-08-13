import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CategoryRepository, ProductRepository } from 'src/DB/repositories';
import { FilteUploadService } from 'src/common/services/fileupload';
import { nanoid } from 'nanoid';
import { Image } from 'src/common/types';
import { FindAllProductsDto, RemoveImageDto } from './dto';
import { MAX_IMAGES_FOR_PRODUCT } from 'src/common/constants';
import slugify from 'slugify';

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
      images = await this._FilteUploadService.saveFileToCloud(files.images, {
        folder: cloudFolder,
      });
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

  async update(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    data: UpdateProductDto,
  ) {
    if (data.name) data['slug'] = slugify(data.name);

    const product = await this._ProductRepository.update({
      filter: { _id: productId, createdBy: userId },
      update: { ...data },
    });

    if (!product) throw new NotFoundException('Product not found');

    return { data: product, message: 'Product Data Updated Successfully!' };
  }

  async remove_image(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    secure_url: string,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        createdBy: userId,
        $or: [
          { 'thumbnail.secure_url': secure_url },
          { 'images.secure_url': secure_url },
        ],
      },
    });

    if (!product) throw new NotFoundException('Product Not Found!');

    const { thumbnail, images } = product;
    // if the image is thumbnail replace it with another image in the images folder
    if (thumbnail?.secure_url == secure_url) {
      if (!images.length)
        throw new BadRequestException(
          "Can't remove the only exisiting image, please upload another one!",
        );
      // remove from cloud
      await this._FilteUploadService.deleteFile([thumbnail.public_id]);
      // replace with the last imag then remove from the db
      const lastImage = images[product.images.length - 1];
      product.thumbnail = lastImage;
      product.images.pop();
    } else {
      const removedImage = images?.find((img) => img.secure_url == secure_url);

      // remove from the cloud
      this._FilteUploadService.deleteFile([removedImage!.public_id]);
      // remove from the db
      product.images = images?.filter((img) => img.secure_url != secure_url);
    }
    await product.save();
    return { data: product, message: 'Image Deleted Successfully!' };
  }

  async add_image(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    file: Express.Multer.File,
    isThumbnail: boolean,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId, createdBy: userId },
    });
    if (!product) throw new NotFoundException('Product not Found!');
    if (!file) throw new NotFoundException('Image not Found!');

    if (isThumbnail) {
      const images = await this._FilteUploadService.saveFileToCloud([file], {
        public_id: product.thumbnail.public_id,
      });
      product.thumbnail = images[0];
    } else if (product.images.length < MAX_IMAGES_FOR_PRODUCT) {
      // add to cloud
      const images = await this._FilteUploadService.saveFileToCloud([file], {
        folder: product.cloudFolder,
      });

      // add to db
      product.images.push(images[0]);
    }
    await product.save();
    return { data: product, message: 'Image Added Successfully' };
  }

  async remove(productId: Types.ObjectId) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId },
    });
    if (!product) throw new NotFoundException('Product Not Found!');

    await product.deleteOne();
    return { message: 'Product Deleted Successfully!' };
  }

  async findAll(query: FindAllProductsDto) {
    const products = await this._ProductRepository.findAll({
      filter: {
        ...(query.category && { category: new Types.ObjectId(query.category) }),
        ...(query.q && {
          $or: [
            { name: { $regex: query.q, $options: 'i' } },
            { description: { $regex: query.q, $options: 'i' } },
          ],
        }),
        ...(query.price && {
          finalPrice: {
            ...(query.price.min !== undefined && { $gte: query.price.min }),
            ...(query.price.max !== undefined && { $lte: query.price.max }),
          },
        }),
      },
      sort: {
        ...(query.sort?.by && {
          [query.sort.by]: query.sort.dir ? query.sort.dir : 1,
        }),
      },
      paginate: { page: query.page ?? 1 },
    });

    return { data: products };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
}
