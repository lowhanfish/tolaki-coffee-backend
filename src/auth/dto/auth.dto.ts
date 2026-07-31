import {IsString, IsEmail, IsNotEmpty, IsOptional} from "class-validator"

export class AuthLoginDTO {
    @IsNotEmpty()
    @IsString()
    username : string;

    @IsNotEmpty()
    @IsString()
    password : string;
}
export class AuthRegisterDTO {

    @IsNotEmpty()
    @IsString()
    username : string;

    @IsNotEmpty()
    @IsString()
    password : string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name : string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address : string;

    @IsNotEmpty()
    @IsString()
    phone : string;

    @IsEmail()
    email : string;
}

