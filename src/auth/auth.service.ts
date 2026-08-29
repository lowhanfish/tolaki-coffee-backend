import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import { TokenType } from './interfaces/auth.interfaces';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDTO) {
    const email = dto.email.trim().toLowerCase();

    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('passwordConfirmation must match password');
    }

    const existingUser = await this.prisma.user.findUnique({where: { email }});

    if (existingUser) {
      throw new ConflictException('email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name?.trim() || null,
        password: hashedPassword,
        provider: AuthProvider.LOCAL,
      },
    });

    const { at, rt } = await this.generateTokens(user.id, user.email);

    const newHashedRT = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: newHashedRT },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: { at, rt },
    };
  }

  async login(dto : LoginDTO){
    
    // 1. Normalisasi email
    const email = dto.email.trim().toLowerCase();

    // 2. Check existing email
    const user = await this.prisma.user.findUnique({
      where : {email}
    }) 
 
    // 3. Jika email tidak ada maka kembalikan error UnauthorizedException
    if(!user || !user.password){
      throw new UnauthorizedException("Wrong username or password")
    }

    // 4. Compare password dengan bcrypt
    const comparePassword = await bcrypt.compare(dto.password, user.password)

    if(!comparePassword){
      throw new UnauthorizedException("Wrong username or password")
    }

    // 5. Generate at dan rt baru
    const {at, rt} = await this.generateTokens(user.id, email)
    
    // 6. Hash rt baru
    const newHashedRT = await bcrypt.hash(rt,10)

    // 7. Update data user
    await this.prisma.user.update({
      where : {id:user.id},
      data : {
        hashedRt : newHashedRT
      }
    })

    return {at, rt}

  }


  async googleLogin(dto: GoogleLoginDto){
    return {
      message : "endpoint google login active",
      status : 200
    }
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