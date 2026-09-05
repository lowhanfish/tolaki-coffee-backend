import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @Allow()
  file?: any;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}

export class ReadProfileDto {
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

export class ResponseProfileDto {
  id: string;
  userId: string;
  bio: string | null;
  phone: string | null;
  avatarUrl: string | null;
  avatarSource: 'LOCAL' | 'GOOGLE' | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ResponseAllProfileDto {
  total: number;
  skip: number;
  limit: number;
  data: ResponseProfileDto[];
}
