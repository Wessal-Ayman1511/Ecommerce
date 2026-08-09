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
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Controller('auth/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService
  ) {}

  @Post('/register')
  async register(@Body() data: CreateUserDTO) {
    const { email } = data;
    this._MailerService.sendMail({
      from: this._ConfigService.get("EMAIL"),
      to:email,
      subject: "Account Activation",
      text: "Activate your account"
    })

    const user = await this.authService.register(data);
    return { success: true, message: 'done', user };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
