import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
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
    example: 100,
    description: 'Jumlah stok produk',
    default: 0,
  })
  @Type(() => Number)
  @IsInt({ message: 'Stock harus berupa bilangan bulat' }) // 2. Validasi tipe number
  @Min(0, { message: 'Stock tidak boleh kurang dari 0' })
  stock: number;

  @ApiProperty({
    example: 'Kopi arabika pilihan dari kebun Tolaki',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ format: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  companyProfileId?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @Allow()
  files?: any[];
}
