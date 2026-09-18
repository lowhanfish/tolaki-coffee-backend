import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductFilesDto {
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  fileIds: string[];
}
