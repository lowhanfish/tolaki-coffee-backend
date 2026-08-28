import {IsString, IsNotEmpty, IsOptional} from 'class-validator'

export class GoogleLoginDto {
    @IsString()
    @IsNotEmpty({ message: 'Credential / ID Token dari Google wajib diisi' })
    credential : string;

    @IsOptional()
    @IsString()
    clientId : string;

    @IsString()
    @IsOptional()
    select_by : string;

}