import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDTO } from './dto/send-email.dto';
import { OTPRepository } from 'src/DB/repositories/otp.repository';
import * as randomstring from 'randomstring';
import { compareHash } from 'src/common/security/hash.utils';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService,
    private readonly _OTPRepository: OTPRepository,
  ) {}
  async register(data: CreateUserDTO) {
    try {
      const { email, otp } = data;

      const otpExist = await this._OTPRepository.findOne({ filter: { email } });
      if (!otpExist || !compareHash(otp, otpExist.otp))
        throw new NotFoundException("OTP Doesn't Match!");
      await otpExist.deleteOne();

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

  async sendOtp(data: SendOtpDTO) {
    // get email > check if email already registered > check if the user click sendOtp 2 times and keep last one only > send email > save in db
    try {
      const { email } = data;

      const user = await this._UserService.userExistByEmail(email);
      if (user) throw new BadRequestException('Email already registered!');

      const otp = await this._OTPRepository.findOne({ filter: { email } });
      if (otp) await otp.deleteOne();

      const newOtp = randomstring.generate(6);

      // send otp
      this._MailerService.sendMail({
        to: email,
        subject: 'Account Activation',
        text: `Your OTP is: ${newOtp}`,
      });
      // save in db
      await this._OTPRepository.create({ email, otp: newOtp });
      return { success: true, message: 'Check your Email!' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
