import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsOptional, IsNotEmpty, IsUUID } from 'class-validator'

export class ReadAllContactDto{
    @IsOptional()
    @IsString()
    search? : string;

    @IsOptional()
    @IsNumber()
    skip? : number;

    @IsOptional()
    @IsNumber()
    limit? : number;
}

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    storeName :string;

    @IsString()
    @IsNotEmpty()
    address :string;

    @IsString()
    @IsNotEmpty()
    phone :string;

    @IsEmail()
    @IsOptional()
    email? :string;

    @IsUUID()
    @IsNotEmpty()
    companyProfileId: string;

    @IsOptional()
    @IsString()
    mapsUrl? :string;
    
    @IsOptional()
    @IsString()
    openHours? :string;

    @IsOptional()
    @IsString()
    instagram? :string;

    @IsOptional()
    @IsString()
    facebook? :string;

    @IsOptional()
    @IsString()
    tiktok? :string;

    @IsOptional()
    @IsString()
    tokopedia? :string;

    @IsOptional()
    @IsString()
    shopee? :string;
}

export class UpdateContactDto extends PartialType(CreateContactDto){}


export class ResponseContactOnceDto {
    id?:string;
    storeName :string;
    address :string;
    phone :string;
    email? :string | null;
    mapsUrl? :string | null;
    openHours? :string | null;
    instagram? :string | null;
    facebook? :string | null;
    tiktok? :string | null;
    tokopedia? :string | null;
    shopee? :string | null;
    createdAt? :Date | null;
    updatedAt? :Date | null;
}

export class ResponseContactDto {
    total : number;
    skip : number;
    limit : number;
    data : ResponseContactOnceDto[]
}
