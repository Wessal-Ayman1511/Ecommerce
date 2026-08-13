import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class PriceDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  max?: number;
}

export class SortDto {
  @IsString()
  @IsOptional()
  by?: string;

  @IsOptional()
  @Type(() => Number)
  @IsIn([1, -1])
  dir?: 1 | -1;
}

export class FindAllProductsDto {
  @IsOptional()
  @IsMongoId()
  category?: Types.ObjectId;

  @IsString()
  @IsOptional()
  q?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  price?: PriceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
