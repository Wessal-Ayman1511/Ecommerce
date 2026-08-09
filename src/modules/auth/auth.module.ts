import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OTPRepository, TokenRepository } from 'src/DB/repositories';
import { OTPModel, TokenModel } from 'src/DB/models';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, OTPRepository, TokenRepository],
  imports: [UserModule, OTPModel, TokenModel]
})
export class AuthModule {}
