import { IsEmail, IsIn, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class CreateUserDTO {


  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;


  @IsString()
  @IsEmail()
  email: string;


  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn([Math.random()], {message: "password must match!"})
  @ValidateIf((obj) => obj.password != obj.cPassword)
  cPassword: string;


  @IsString()
  otp: string
}
