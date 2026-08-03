// src/auth/guards/at.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/public.decorator';

@Injectable()
export class AtGuard extends AuthGuard('jwt-at') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Cek apakah ada decorator @Public() di handler (method) atau di class (controller)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Jika ada decorator @Public(), izinkan request lewat TANPA cek Access Token
    if (isPublic) {
      return true;
    }

    // 3. Jika TIDAK ada @Public(), jalankan verifikasi AtStrategy bawaan AuthGuard('jwt')
    return super.canActivate(context);
  }
}