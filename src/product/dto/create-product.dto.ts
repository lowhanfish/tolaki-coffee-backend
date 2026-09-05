import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Kopi Arabika Tolaki' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 125000 })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ example: '250 gram' })
  @IsString()
  @IsNotEmpty()
  unit_price: string;

  @ApiProperty({
    example: 'Kopi arabika pilihan dari kebun Tolaki',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  companyProfileId: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @Allow()
  files?: any[];
}
