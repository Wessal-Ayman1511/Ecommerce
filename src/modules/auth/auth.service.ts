import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService,
  ) {}
  async register(data: CreateUserDTO) {
    try {
      const { email } = data;
      this._MailerService.sendMail({
        from: this._ConfigService.get('EMAIL'),
        to: email,
        subject: 'Account Activation',
        text: 'Activate your account',
      });

      const user = await this._UserService.create(data);
      return { success: true, message: 'done', user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(data: LoginDTO) {
    // get data
    const { email, password } = data;

    // validate user
    const user = await this._UserService.validateUser(data);

    // access and refresh toke
    const access_token = this._JwtService.sign(
      { id: user._id },
      {
        secret: this._ConfigService.get('JWT_SECRET'),
        expiresIn: this._ConfigService.get('SECRET_EXPIRE_IN'),
      },
    );
    const refresh_token = this._JwtService.sign(
      { id: user.id },
      {
        secret: this._ConfigService.get('JWT_SECRET'),
        expiresIn: this._ConfigService.get('REFRESH_EXPIRE_IN'),
      },
    );
    return {
      success: true,
      message: 'login successfully',
      access_token,
      refresh_token,
    };
  }
}
