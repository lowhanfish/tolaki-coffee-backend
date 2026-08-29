import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import { TokenType } from './interfaces/auth.interfaces';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDTO) {
    // 1. Normalisasi email
    const email = dto.email.trim().toLowerCase();

    // 2. Validasi konfirmasi password
    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('passwordConfirmation must match password');
    }

    // 3. Cek keberadaan user
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('email already registered');
    }

    // 4. Hash password utama
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 5. Simpan user ke database
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name?.trim() || null,
        password: hashedPassword,
        provider: AuthProvider.LOCAL,
      },
    });

    // 6. Generate token pair
    const { at, rt } = await this.generateTokens(user.id, user.email);

    // 7. Hash & simpan Refresh Token ke DB (opsional tapi sangat disarankan untuk keamanan)
    const hashRT = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: hashRT },
    });

    // 8. Return token pair (opsional: sertakan data user non-sensitif jika dibutuhkan client)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: { at, rt },
    };
  }

  // --- HELPER METHODS ---

  private async generateTokens(id: string, email: string): Promise<TokenType> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email, type: 'access' },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: id, email, type: 'refresh' },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { at, rt };
  }
}