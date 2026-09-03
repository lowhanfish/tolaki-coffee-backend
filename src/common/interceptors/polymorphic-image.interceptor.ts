import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

export function PolymorphicImageInterceptor(tableName: string): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      return next.handle().pipe(
        tap(async (createdRecord) => {
          // 1. Cek apakah controller mengembalikan data yang memiliki ID
          const targetId = createdRecord?.id;
          if (!targetId) return;

          const createdBy = request.user?.userId;
          if (!createdBy) {
            throw new UnauthorizedException('User belum terautentikasi');
          }

          // 2. Ambil file dari request (dari Multer)
          const file = request.file as Express.Multer.File;
          const files = request.files as Express.Multer.File[];

          // 3. Handling Single File Upload
          if (file) {
            await this.prisma.file.create({
              data: {
                path: file.path,
                title: file.filename,
                type: file.mimetype,
                table_name: tableName,
                table_id: String(targetId),
                createdBy,
              },
            });
          }

          // 4. Handling Multiple Files Upload
          if (files && files.length > 0) {
            await this.prisma.file.createMany({
              data: files.map((f) => ({
                path: f.path,
                title: f.filename,
                type: f.mimetype,
                table_name: tableName,
                table_id: String(targetId),
                createdBy,
              })),
            });
          }
        }),
      );
    }
  }

  return mixin(MixinInterceptor);
}
