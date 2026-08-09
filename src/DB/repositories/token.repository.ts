import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { TokenDocument, tokenModelName } from '../models/token.model';
import { Model } from 'mongoose';

@Injectable()
export class TokenRepository extends AbstractRepository<TokenDocument> {
  constructor(@InjectModel(tokenModelName) Token: Model<TokenDocument>) {
    super(Token);
  }
}
  