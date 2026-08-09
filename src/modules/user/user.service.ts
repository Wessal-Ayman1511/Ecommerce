import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}

  async create(data: CreateUserDTO) {
    return  this._UserRepository.create(data);
  }
}
