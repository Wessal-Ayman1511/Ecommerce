import { IsEmail, IsString } from "class-validator";


export class SendOtpDTO {

    @IsEmail()
    @IsString()
    email: string
}