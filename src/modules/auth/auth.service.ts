import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as randomstring from 'randomstring';
import { UserService } from '../user/user.service';
import { CartRepository, OTPRepository, TokenRepository } from 'src/DB/repositories';
import {
  ForgetPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SendOtpDTO,
} from './dto';
import { CreateUserDTO } from '../user/dto';
import { compareHash } from 'src/common/security';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _MailerService: MailerService,
    private readonly _ConfigService: ConfigService,
    private readonly _JwtService: JwtService,
    private readonly _OTPRepository: OTPRepository,
    private readonly _TokenRepository: TokenRepository,
    private readonly _CartRepository: CartRepository,
  ) {}
  async register(data: CreateUserDTO) {
    const { email, otp } = data;

    const otpExist = await this._OTPRepository.findOne({ filter: { email } });
    if (!otpExist || !compareHash(otp, otpExist.otp))
      throw new NotFoundException("OTP Doesn't Match!");
    await otpExist.deleteOne();

    const user = await this._UserService.create({
      ...data,
      accountActivated: true,
    });

    // create cart for the user
    await this._CartRepository.create({user: user._id})
    
    return { success: true, message: 'done', user };
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

    await this._TokenRepository.create({ user: user._id, token: access_token });
    await this._TokenRepository.create({
      user: user._id,
      token: refresh_token,
    });
    console.log(access_token);
    console.log(refresh_token);

    return {
      success: true,
      message: 'login successfully',
      data: { access_token, refresh_token },
    };
  }

  async sendOtp(data: SendOtpDTO) {
    // get email > check if email already registered > check if the user click sendOtp 2 times and keep last one only > send email > save in db

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
  }

  async forgetPassword(data: ForgetPasswordDTO) {
    const { email } = data;

    const user = await this._UserService.userExistByEmail(email);
    if (!user)
      throw new UnauthorizedException('This Email not linked to account!');

    if (!user.accountActivated)
      throw new BadRequestException('This account is not activated yet!');

    // this because if user  click on the send otp more than one time, the last one is the only valid one
    const otp = await this._OTPRepository.findOne({ filter: { email } });
    if (otp) await otp.deleteOne();

    const newOtp = randomstring.generate(6);

    this._MailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      text: `Yout OTP is: ${newOtp}`,
    });
    await this._OTPRepository.create({ email, otp: newOtp });

    return { success: true, message: 'Check your Email!' };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const { email, password, otp } = data;

    const user = await this._UserService.userExistByEmail(email);
    if (!user)
      throw new UnauthorizedException('This Email not linked to account!');

    if (!user.accountActivated)
      throw new BadRequestException('This account is not activated yet!');

    const otpDoc = await this._OTPRepository.findOne({ filter: { email } });
    if (!otpDoc || !compareHash(otp, otpDoc.otp))
      throw new UnauthorizedException('Invalid OTP!');

    user.password = password;
    await user.save();

    const oldUserTokens = await this._TokenRepository.findAll({
      filter: { user: user._id },
    });

    if (oldUserTokens.data.length) {
      for (const token of oldUserTokens.data) {
        token.isValid = false;
        await token.save();
      }
    }
    return { success: true, message: 'Passwrod reset successfully!' };
  }
}
