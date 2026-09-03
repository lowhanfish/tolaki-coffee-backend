import { PartialType, ApiProperty } from '@nestjs/swagger';
import {Allow ,IsString, IsNumber, IsNotEmpty, IsOptional} from 'class-validator'



export class CreateNewsDto{

    @IsString()
    @IsNotEmpty()
    title : string;
    
    @IsString()
    @IsNotEmpty()
    description : string;
    
    @IsString()
    @IsNotEmpty()
    news : string;
    
    @IsString()
    @IsOptional()
    source? : string;
    
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
    })
    @Allow()
    file?: any;

}

export class ReadNewsDto{
    @IsNumber()
    @IsOptional()
    skip? : number;

    @IsNumber()
    @IsOptional()
    limit? : number;
    
    @IsString()
    @IsOptional()
    search? : string;

}
export class UpdateNewsDto extends PartialType(CreateNewsDto){}
export class ResponseOnceNewsDto{
    id : string;
    title : string;
    description? : string | null;
    news : string;
    file? : string | null;
    source? : string | null;
    createdAt : string;
    updatedAt? : string | null;
}
export class ResponseAllNewsDto{
    total : number;
    skip : number;
    limit : number;
    data : ResponseOnceNewsDto[]

}

