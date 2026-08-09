import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { OTPRepository } from 'src/DB/repositories/otp.repository';
import { OTPModel } from 'src/DB/models/otp.model';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { TokenModel } from 'src/DB/models/token.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, OTPRepository, TokenRepository],
  imports: [UserModule, OTPModel, TokenModel]
})
export class AuthModule {}
