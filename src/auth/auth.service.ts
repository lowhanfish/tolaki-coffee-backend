import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {JwtService} from "@nestjs/jwt"
import {AuthRegisterDTO} from "./dto/auth.dto"
import {User} from './entities/user.entity'

@Injectable()
export class AuthService {

  constructor(
    private prisma : PrismaService,
    private jwt : JwtService
  ){}
  
  async authRegister(dto: AuthRegisterDTO){
    // 1. Cek Akun (email/password) apakah sudah ada atau belum.
    const userCheck = await this.prisma.user.findFirst({
      where : {
        OR : [
          { email : dto.email },
          { username: dto.username }
        ]

      }
    })

    // 2. Kalau sudah ada kembalikan Bad Request Exception.
    if(userCheck) throw new BadRequestException("Email atau username sudah terdaftar sebelumnya")
    
    // 3. Hasing password dari dto menggunakan bcrypt.
    const hashpassword = await bcrypt.hash(dto.password, 10)

    // 4. Store dto ke dalam database  dengan prisma, termasuk password yang telah di hasing.
    const userStore = await this.prisma.user.create({
      data : {
        email : dto.email,
        username : dto.username,
        name : dto.name,
        address : dto.address,
        phone : dto.phone,
        password : hashpassword
      }
    })
    // 6. Generate token (Access Token (AT): 15 menit, Refresh Token (RT) : 7 Hari) berdasarkan (id, username/email) dari data yang kita tangkap sebelumnya.
    const token = await this.generateToken(userStore)
    
    // 7. Hasing RT yang baru saja di generate.
    const hashedRT = await bcrypt.hash(token.rt, 10)

    // 8. Update tabel akun yang bersangkutan dengan mengubah RT hasil hashing.
    await this.updateRT(userStore.id, hashedRT)

    return token
  
  }

  authLogin(){

    // 1. Cek Keberadaan User: Cari user di DB via Prisma berdasarkan email. Jika tidak ketemu = Throw UnauthorizedException('Invalid credentials').
    // 2. Verifikasi Password: Bandingkan password dari DTO dengan password (hash) di DB menggunakan bcrypt.compare(). Jika tidak cocok = Throw UnauthorizedException('Invalid credentials').
    // 3. Generate JWT Tokens: Buat accessToken (misal exp: 15m) dan refreshToken (misal exp: 7d).
    // 4. Hash Refresh Token: Lakukan bcrypt.hash(refreshToken, 10).
    // 5. Update DB via Prisma: Simpan Hash Refresh Token ke field hashedRefreshToken milik user tersebut di database.
    // 6. Set refreshToken ke dalam header HTTP Response sebagai HTTP-Only Cookie.
    // 7. Return accessToken (dan data user ringkas) di JSON Body response.

  }
  authRefreshToken(){

  }

  authGetProfile(){

  }
  
  findOne(email : string){
    return `Hy saya dari services, username saya adalah ${email}`
  }

  async generateToken(userStore:User){
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {sub:userStore.id, username: userStore.username},
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn:'15m' },
      ),
      this.jwt.signAsync(
        {sub:userStore.id, username: userStore.username},
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn:'7d' },
      )
    ])

    return {
      at : at,
      rt : rt
    }

  }

  async updateRT(id:string, hashedRT:string){
    await this.prisma.user.update({
      where : {id:id},
      data : {hashedRT : hashedRT}
    })
  }

}
