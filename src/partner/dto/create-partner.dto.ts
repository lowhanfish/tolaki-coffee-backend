import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Mitra Kopi ABC' })
  @IsString()
  @IsNotEmpty()
  partner: string;

  @ApiProperty({ example: 12.5 })
  @Type(() => Number)
  @IsNumber()
  area: number;

  @ApiProperty({ example: 800 })
  @Type(() => Number)
  @IsNumber()
  altitude_from: number;

  @ApiProperty({ example: 1200 })
  @Type(() => Number)
  @IsNumber()
  altitude_to: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  companyProfileId: string;
}
