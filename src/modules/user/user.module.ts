import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/models/user.model';

@Module({
  imports: [UserModel],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
