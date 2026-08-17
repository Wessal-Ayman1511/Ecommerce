import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaymendMethod } from "src/DB/enums/order.enum";

export class CreateOrderDto {


    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    address: string


    @IsEnum(PaymendMethod)
    @IsOptional()
    paymentMethod: PaymendMethod
}
