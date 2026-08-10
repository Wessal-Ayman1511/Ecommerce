import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument, CategoryModelName } from '../models/category.model';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
  constructor(@InjectModel(CategoryModelName) Category: Model<CategoryDocument>) {
    super(Category);
  }
}
  