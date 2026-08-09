import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.utils';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}

  async create(data: CreateUserDTO) {
    return this._UserRepository.create(data);
  }

  async validateUser(data: LoginDTO) {
    const { email, password } = data;
    const user = await this._UserRepository.findOne({ filter: { email } });
    if (!user || !compareHash(password, user.password))
      throw new UnauthorizedException('Invalid Credentials!');

    return user;
  }

}
