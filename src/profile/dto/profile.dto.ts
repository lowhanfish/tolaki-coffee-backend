import {IsString, IsNumber, IsNotEmpty, IsOptional} from 'class-validator'

export class CreateProfileDto {

    @IsString()
    @IsNotEmpty()
    brand : string;

    @IsString()
    @IsOptional()
    quotes : string;
    
    @IsString()
    description : string;
    
    @IsString()
    @IsOptional()
    detail : string;
}

