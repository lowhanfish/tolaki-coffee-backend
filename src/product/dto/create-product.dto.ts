import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number) // Transform string from request body to number
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  unit_price: string;

  @IsString()
  @IsOptional()
  description?: string;
}