import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.utils';
import { UserDocument } from 'src/DB/models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}

  async create(data: Partial<UserDocument>) {
    return this._UserRepository.create(data);
  }

  async validateUser(data: LoginDTO) {
    const { email, password } = data;
    const user = await this._UserRepository.findOne({ filter: { email } });
    if (!user || !compareHash(password, user.password))
      throw new UnauthorizedException('Invalid Credentials!');

    return user;
  }

  async userExistByEmail(email:string){
    const user = await this._UserRepository.findOne({filter: {email}})
    return user
  }

}
