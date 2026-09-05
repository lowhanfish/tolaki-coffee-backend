import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStoryFromGardenDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  news: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @Allow()
  file: any;
}

export class ReadStoryFromGardenDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateStoryFromGardenDto extends PartialType(CreateStoryFromGardenDto) {}

export class ResponseOnceStoryFromGardenDto {
  id: string;
  title: string;
  news: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export class ResponseAllStoryFromGardenDto {
  total: number;
  skip: number;
  limit: number;
  data: ResponseOnceStoryFromGardenDto[];
}
