import {IsEmail, IsString, IsNotEmpty, IsOptional, MaxLength, MinLength} from 'class-validator'

export class RegisterDTO{
    @IsEmail()
    email : string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name : string;

    @IsString()
    @MaxLength(12)
    @MinLength(6)
    password : string;

    @IsString()
    @IsNotEmpty()
    passwordConfirmation : string;
}