import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ForgetPasswordDTO {

    @IsEmail()
    @IsString()
    email: string

  
}
