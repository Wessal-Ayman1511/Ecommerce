import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user.dto';

@Controller('auth/')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/register')
  register(@Body() data: CreateUserDTO) {
    return this._authService.register(data);
  }
  
}
