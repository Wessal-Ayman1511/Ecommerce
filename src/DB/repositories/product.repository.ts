import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, ProductModelName } from '../models/product.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(@InjectModel(ProductModelName) Product: Model<ProductDocument>) {
    super(Product);
  }
}
  