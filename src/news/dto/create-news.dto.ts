import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  news: string;

  @IsOptional()
  @IsString()
  source?: string;
}