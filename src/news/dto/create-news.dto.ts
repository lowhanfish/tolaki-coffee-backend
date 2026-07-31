import {IsString, IsNotEmpty, IsNumber, IsDate} from "class-validator"

export class CreateNewsDto {

    @IsNotEmpty()
    @IsString()
    title : string;

    @IsNotEmpty()
    @IsString()
    desc : string;

    @IsString()
    value : string;

}
