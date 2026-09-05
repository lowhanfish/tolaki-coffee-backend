import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service'; // Sesuaikan path PrismaService Anda
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthProvider, AvatarSource } from '../../generated/prisma/enums';

@Injectable()
export class AuthService {
  // Inisialisasi Google OAuth Client dengan Client ID dari process.env
  // Object ini dipakai untuk memverifikasi ID Token yang dikirim oleh frontend.
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDTO) {
    // 1. Normalisasi email agar User@Example.com dan user@example.com
    // tidak dianggap sebagai dua akun berbeda.
    const email = dto.email.trim().toLowerCase();

    // 2. Pastikan password confirmation sama dengan password utama.
    // Perbandingan ini dilakukan di service karena kedua nilai berasal dari request
    // dan @Equals() class-validator membandingkan dengan nilai literal, bukan field lain.
    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('passwordConfirmation must match password');
    }

    // 3. Cek apakah email sudah terdaftar sebelum membuat record baru.
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // 4. Jangan pernah menyimpan password plaintext.
    // Angka 10 adalah bcrypt salt rounds yang digunakan untuk membuat hash.
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 5. Buat user manual di database menggunakan email, name, dan password hash.
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name?.trim() || null,
        password: hashedPassword,
        provider: AuthProvider.LOCAL,
      },
    });

    // 6. Setelah registrasi berhasil, langsung login-kan user dengan cookie JWT.
    return this.issueTokens(user.id, user.email);
  }

  async login(dto: LoginDTO) {
    // 1. Normalisasi email dengan aturan yang sama seperti register.
    const email = dto.email.trim().toLowerCase();

    // 2. Cari user berdasarkan email unik.
    const user = await this.prisma.user.findUnique({ where: { email } });

    // 3. Bandingkan password request dengan bcrypt hash di database.
    // Pesan error dibuat umum agar tidak membocorkan apakah email terdaftar.
    if (
      !user ||
      user.provider !== AuthProvider.LOCAL ||
      !user.password ||
      !(await bcrypt.compare(dto.password, user.password))
    ) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // 4. Password valid, sehingga terbitkan access token dan refresh token baru.
    return this.issueTokens(user.id, user.email);
  }

  async authenticateGoogleUser(idToken: string) {
    try {
      // 1. Verifikasi ID Token dari Google secara aman
      // Google memeriksa signature, masa berlaku token, dan audience/client ID.
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Payload berisi informasi user yang sudah ditandatangani oleh Google.
      if (!payload)
        throw new UnauthorizedException('Payload token Google tidak valid');

      const {
        email,
        name,
        picture,
        sub: providerId,
        email_verified: emailVerified,
      } = payload;
      // Email diperlukan sebagai identitas user lokal.
      // Hanya email yang sudah diverifikasi Google yang boleh dipakai login.
      if (!email || !emailVerified) {
        throw new UnauthorizedException('Email Google belum terverifikasi');
      }
      const normalizedEmail = email.trim().toLowerCase();

      // 2. Cari user berdasarkan Email di DB
      // Email diberi @unique di schema.prisma, sehingga findUnique aman digunakan.
      let user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      // 3. Jika user belum ada, buat user baru
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name || 'Google User',
            provider: AuthProvider.GOOGLE,
            providerId,
            profile: {
              create: {
                avatarUrl: picture ?? null,
                avatarSource: picture ? AvatarSource.GOOGLE : null,
              },
            },
          },
        });
      } else {
        // Akun lama mungkin dibuat sebelum profile/avatar Google diterapkan.
        // Upsert memastikan profile tersedia tanpa mengubah field profile lainnya.
        await this.prisma.profile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            avatarUrl: picture ?? null,
            avatarSource: picture ? AvatarSource.GOOGLE : null,
          },
          update: picture
            ? {
                avatarUrl: picture,
                avatarSource: AvatarSource.GOOGLE,
              }
            : {},
        });
      }

      // 4. User sudah ditemukan atau berhasil dibuat.
      // Sekarang buat access token dan refresh token untuk aplikasi kita sendiri.
      return this.issueTokens(user.id, user.email);
    } catch (error) {
      // Error UnauthorizedException sengaja diteruskan agar pesan validasi tetap jelas.
      // Error lain disamarkan sebagai error autentikasi agar detail internal tidak bocor.
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException(
        'Token Google tidak valid atau telah kadaluarsa',
      );
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      // RtGuard/RtStrategy sudah memverifikasi signature, expiry, dan tipe token.
      // Service sekarang fokus pada pemeriksaan token terhadap hash di database.
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      // Bandingkan refresh token asli dengan hash yang tersimpan di database.
      // Ini membuat database tidak perlu menyimpan refresh token dalam bentuk plaintext.
      if (
        !user?.hashedRt ||
        !(await bcrypt.compare(refreshToken, user.hashedRt))
      ) {
        throw new UnauthorizedException('Refresh token tidak valid');
      }

      // Jika valid, terbitkan pasangan token baru dan ganti hash refresh token lama.
      return this.issueTokensWithoutUser(user.id, user.email);
    } catch (error) {
      // Token kadaluarsa, token rusak, user tidak ditemukan, atau hash tidak cocok
      // semuanya diperlakukan sebagai refresh token yang tidak valid.
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException(
        'Refresh token tidak valid atau telah kadaluarsa',
      );
    }
  }

  async logout(userId: string) {
    // Menghapus hash refresh token membuat refresh token lama tidak bisa digunakan lagi,
    // walaupun seseorang masih memilikinya sebelum cookie dihapus.
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });
  }

  private async issueTokens(id: string, email: string) {
    const { accessToken, refreshToken, hashedRt } = await this.createTokenPair(
      id,
      email,
    );

    // Menyimpan hash juga menerapkan konsep satu refresh token aktif per user.
    // Penerbitan token baru otomatis menggantikan token sebelumnya.
    const user = await this.prisma.user.update({
      where: { id },
      data: { hashedRt },
      select: {
        id: true,
        email: true,
        name: true,
        profile: true,
      },
    });

    // Token dikembalikan ke controller agar controller dapat memasukkannya ke httpOnly cookie.
    // Object user hanya berisi field yang aman untuk response dan profile terbaru.
    return { accessToken, refreshToken, user };
  }

  private async issueTokensWithoutUser(id: string, email: string) {
    const { accessToken, refreshToken, hashedRt } = await this.createTokenPair(
      id,
      email,
    );

    // Refresh hanya merotasi token sehingga tidak perlu memuat relasi profile.
    await this.prisma.user.update({
      where: { id },
      data: { hashedRt },
    });

    return { accessToken, refreshToken };
  }

  private async createTokenPair(id: string, email: string) {
    // Access token berumur pendek dan dipakai untuk mengakses endpoint terlindungi.
    const accessToken = this.jwtService.sign(
      { sub: id, email, type: 'access' },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );

    // Refresh token berumur lebih panjang dan hanya dipakai untuk meminta access token baru.
    const refreshToken = this.jwtService.sign(
      { sub: id, email, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    // Simpan hanya hash refresh token di database.
    // Jika database bocor, token asli tidak langsung dapat dipakai.
    const hashedRt = await bcrypt.hash(refreshToken, 10);

    return { accessToken, refreshToken, hashedRt };
  }
}
