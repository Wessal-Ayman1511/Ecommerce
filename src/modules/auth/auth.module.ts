import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import {
  OTPRepository,
  TokenRepository,
} from 'src/DB/repositories';
import { OTPModel, TokenModel } from 'src/DB/models';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGaurd, RoleGuard } from 'src/common/guards';
import { CartModule } from '../cart/cart.module';
;


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    OTPRepository,
    TokenRepository,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGaurd,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
  ],
  imports: [UserModule, OTPModel, TokenModel, CartModule],
})
export class AuthModule {}
