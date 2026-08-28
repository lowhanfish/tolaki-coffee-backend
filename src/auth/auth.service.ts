import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt'
import {OAuth2Client} from 'google-auth-library'
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from 'generated/prisma/enums';
import * as bcrypt from 'bcrypt'
import {TokenType} from './interfaces/auth.interfaces'





import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';


@Injectable()
export class AuthService {

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  constructor(
    private jwtservice : JwtService,
    private prisma : PrismaService
  ){}
 
  async login(dto : LoginDTO){

    return dto

  }

  async register(dto : RegisterDTO){

    // 1. Normalisasi email agar User@Example.com dan user@example.com
    // tidak dianggap sebagai dua akun berbeda.
    const email = dto.email.trim().toLowerCase()

    // 2. Pastikan password confirmation sama dengan password utama.
    // Perbandingan ini dilakukan di service karena kedua nilai berasal dari request
    // dan @Equals() class-validator membandingkan dengan nilai literal, bukan field lain.
    if(dto.password !== dto.passwordConfirmation){
      throw new BadRequestException("passwordConfirmation must match password")
    }

    // 3. Cek apakah email sudah terdaftar sebelum membuat record baru.
    const existingUser = await this.prisma.user.findUnique({where : {email : email}})
    if (existingUser){
      throw new ConflictException("email already registered")
    }

    // 4. Jangan pernah menyimpan password plaintext.
    // Angka 10 adalah bcrypt salt rounds yang digunakan untuk membuat hash.
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    // 5. Buat user manual di database menggunakan email, name, dan password hash.
    const user  = await this.prisma.user.create({
      data : {
        email : email,
        name : dto.name?.trim() || null,
        password : hashedPassword,
        provider : AuthProvider.LOCAL
      },
    })

    // 6. Setelah registrasi berhasil, langsung login-kan user dengan cookie JWT.
    


  }

  async refreshToken(userId: string, refreshToken:string){

  }

  async logout(userId : string){

  }

  async authenticateGoogleUser(idToken:string){

  }

  

  async getToken(dto:RegisterDTO):Promise<TokenType>{
    const [at, rt] = await Promise.all([
      "contoh",
      "contoh"
    ])

    return {
      at:at, 
      rt:rt
    }

  }


}
