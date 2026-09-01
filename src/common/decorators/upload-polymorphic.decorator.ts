import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { UploadSingle, UploadMultiple } from './upload-file.decorator';
import { PolymorphicImageInterceptor } from '../interceptors/polymorphic-image.interceptor';

// Composite Decorator: Upload 1 File + Auto Insert Prisma Polymorphic
export const UploadAndSavePolymorphic = (
  tableName: string,
  fieldName = 'file',
  destination = './uploads',
) => {
  return applyDecorators(
    UploadSingle(fieldName, destination),
    UseInterceptors(PolymorphicImageInterceptor(tableName)),
  );
};

// Composite Decorator: Upload Banyak File + Auto Insert Prisma Polymorphic
export const UploadMultipleAndSavePolymorphic = (
  tableName: string,
  fieldName = 'files',
  maxCount = 10,
  destination = './uploads',
) => {
  return applyDecorators(
    UploadMultiple(fieldName, maxCount, destination),
    UseInterceptors(PolymorphicImageInterceptor(tableName)),
  );
};