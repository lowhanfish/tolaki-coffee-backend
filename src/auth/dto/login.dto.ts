import {IsEmail, IsString, IsNotEmpty} from 'class-validator'

export class LoginDTO {

    @IsEmail()
    email :string

    @IsString()
    @IsNotEmpty()
    password :string
}