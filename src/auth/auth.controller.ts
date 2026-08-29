import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleLoginDTO } from './dto/google-login.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { RtAuthGuard } from './guards/rt.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from './constants/auth.constant';

// Controller menerima HTTP request dan mengembalikan HTTP response.
// Controller sebaiknya tidak berisi aturan bisnis yang panjang;
// aturan autentikasi diletakkan di AuthService.
@Controller('auth')
// Authentication endpoints use a stricter limit to slow down brute-force attempts.
@Throttle({ default: { limit: 5, ttl: 60_000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  // Membuat akun manual menggunakan email dan password.
  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return { message: 'Registrasi berhasil', user: result.user };
  }

  // POST /auth/login
  // Login manual menggunakan email dan password.
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDTO, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return { message: 'Login berhasil', user: result.user };
  }

  // POST /auth/google
  // Frontend mengirim Google ID Token melalui body { credential }.
  @Post('google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async googleAuth(@Body() dto: GoogleLoginDTO, @Res({ passthrough: true }) response: Response) {
    // Memanggil logika verifikasi di AuthService menggunakan field `credential`.
    const result = await this.authService.authenticateGoogleUser(dto.credential);

    // Token tidak dikirim dalam JSON response.
    // Browser akan menyimpannya sebagai cookie dan mengirimkannya otomatis pada request berikutnya.
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    // Hanya data user yang aman dikembalikan ke frontend.
    // accessToken dan refreshToken tidak perlu terlihat oleh JavaScript frontend.
    return { message: 'Login Google berhasil', user: result.user };
  }

  // POST /auth/refresh
  // Dipanggil ketika access token sudah kadaluarsa.
  @Post('refresh')
  @Public()
  @UseGuards(RtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUser('userId') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // RtStrategy sudah membaca cookie dan menempelkan data ke request.user.
    const result = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );

    // Refresh token juga di-rotate: token lama diganti token baru.
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return { message: 'Token berhasil diperbarui', user: result.user };
  }

  // POST /auth/logout
  // Logout memerlukan access token agar userId bisa diambil dari request.user.
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    // request.user diisi oleh AtStrategy setelah token berhasil diverifikasi.
    await this.authService.logout((request.user as { userId: string }).userId);

    // Menghapus cookie di browser.
    response.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
  }

  // Helper ini memastikan semua jenis login memakai konfigurasi cookie yang sama.
  private setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOptions());
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions());
  }
}