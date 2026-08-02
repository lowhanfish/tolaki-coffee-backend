// src/auth/strategies/at.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Payload JWT yang tersimpan saat generateToken()
type JwtPayload = {
  sub: string;      // ID User
  username: string; // Username User
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 1. Ekstrak Token dari Header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Abaikan token yang sudah kedaluwarsa (otomatis throw Error 401 jika expired)
      ignoreExpiration: false,
      // 3. Secret key untuk memverifikasi keaslian token
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default_access_secret_key',
    });
  }

  // 4. Dipanggil OTOMATIS jika token asli & belum expired
  async validate(payload: JwtPayload) {
    // Apapun yang di-return di sini akan otomatis ditempelkan NestJS ke `req.user`
    return payload;
  }
}