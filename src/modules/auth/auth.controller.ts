import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { SendOtpDTO } from './dto/send-email.dto';

@Controller('auth/')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/register')
  register(@Body() data: CreateUserDTO) {
    return this._authService.register(data);
  }

  @Post('/login')
  login(@Body() data: LoginDTO ) {
    return this._authService.login(data);
  }

  @Post('/send-otp')
  sendOtp(@Body() data: SendOtpDTO ) {
    return this._authService.sendOtp(data);
  }


}
