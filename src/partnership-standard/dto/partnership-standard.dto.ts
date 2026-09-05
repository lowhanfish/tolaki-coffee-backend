import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePartnershipStandardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class ReadAllPartnershipStandardDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class UpdatePartnershipStandardDto extends PartialType(CreatePartnershipStandardDto) {}

export class ResponsePartnershipStandardOnceDto {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export class ResponsePartnershipStandardDto {
  total: number;
  skip: number;
  limit: number;
  data: ResponsePartnershipStandardOnceDto[];
}
