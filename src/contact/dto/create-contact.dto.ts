import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('ID') // Validasi untuk nomor telepon Indonesia
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  mapsUrl?: string;

  @IsOptional()
  @IsString()
  openHours?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  tiktok?: string;

  @IsOptional()
  @IsUrl()
  tokopedia?: string;

  @IsOptional()
  @IsUrl()
  shopee?: string;
}