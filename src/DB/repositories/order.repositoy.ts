import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument, OrderModelName } from '../models/order.model';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(@InjectModel(OrderModelName) Order: Model<OrderDocument>) {
    super(Order);
  }
}
  