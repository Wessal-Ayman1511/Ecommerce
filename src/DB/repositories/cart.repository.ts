import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CartDocument, CartModelName } from '../models/cart.model';
import { Model } from 'mongoose';

@Injectable()
export class CartRepository extends AbstractRepository<CartDocument> {
  constructor(@InjectModel(CartModelName) Cart: Model<CartDocument>) {
    super(Cart);
  }
}
  