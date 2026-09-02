import {IsNumber, IsNotEmpty, IsOptional, IsString} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class TestingDto {
    @ApiProperty({example : 8})
    @IsNotEmpty()
    @IsNumber()
    a: number;

    @ApiProperty({example : 4})
    @IsNotEmpty()
    @IsNumber()
    b: number;

    @IsNumber()
    @IsOptional()
    result? : number;

    @IsString()
    @IsOptional()
    typex? : string;
}