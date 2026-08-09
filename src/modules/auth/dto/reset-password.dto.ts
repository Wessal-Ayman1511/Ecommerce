import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn([Math.random()], { message: 'password must match!' })
  @ValidateIf((obj) => obj.password != obj.cPassword)
  cPassword: string;
}
