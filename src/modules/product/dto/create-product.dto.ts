import { Type } from "class-transformer";
import { IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProductDto {


    @IsString()
    @IsNotEmpty()
    name: string


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string


    @IsNumber()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    stock: number


    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    price: number

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    discount: number
}
