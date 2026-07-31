import {IsString, IsEmail, IsNotEmpty, IsOptional} from "class-validator"

export class AuthLoginDTO {
    username : string;
    password : string;
}
export class AuthRegisterDTO {
    username : string;
    password : string;
}
export class AuthRefreshDTO {
    username : string;
    password : string;
}
export class AuthProfileDTO {
    username : string;
    password : string;
}