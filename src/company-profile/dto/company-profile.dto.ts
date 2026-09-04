import { PartialType, ApiProperty } from '@nestjs/swagger'
import {Allow, IsString, IsNumber, IsNotEmpty, IsOptional} from 'class-validator'

export class CreateCompanyDto {
    @IsString()
    brand : string;

    @IsString()
    quotes : string;

    @IsString()
    description : string;

    @IsString()
    detail : string;

    @IsString()
    @IsOptional()
    email? : string;

    @IsString()
    @IsOptional()
    phone? : string;

    @IsString()
    @IsOptional()
    address? : string;

    @IsString()
    @IsOptional()
    @Allow()
    @ApiProperty({
        type : 'string',
        format : 'binary',
        required : false
    })
    file? : string;

    @IsString()
    createdAt : string;
}

export class ReadCompanyDto {
    @IsNumber()
    @IsOptional()
    skip? : number;

    @IsNumber()
    @IsOptional()
    limit? : number;

    @IsNumber()
    search : string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
export class ResponseOnceCompanyDto {
    id : string;
    brand : string;
    quotes : string;
    description : string;
    detail : string;
    email? : string;
    phone? : string;
    address? : string;
    file? : string;
    createdAt : string;
    updateAt : string;
    createdBy : string;
}
export class ResponseAllCompanyDto {
    skip? : number;
    total? : number;
    limit? : number;
    data : ResponseOnceCompanyDto[]

}