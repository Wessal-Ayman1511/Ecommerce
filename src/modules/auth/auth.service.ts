import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
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
}
