import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Mengambil data yang sudah ditempelkan strategy ke request.user.
// Contoh: @GetCurrentUser('userId') userId: string
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);