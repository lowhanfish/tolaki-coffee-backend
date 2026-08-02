import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {JwtService} from "@nestjs/jwt"
import {AuthRegisterDTO, AuthLoginDTO} from "./dto/auth.dto"
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

  async authLogin(dto : AuthLoginDTO){

    // 1. Cek Keberadaan User: Cari user di DB via Prisma berdasarkan email. Jika tidak ketemu = Throw UnauthorizedException('Invalid credentials').
    const userCheck = await this.prisma.user.findUnique({
      where : {username: dto.username}
    })
    if(!userCheck){
      throw new UnauthorizedException("Username atau password tidak ditermukan")
    }
    // 2. Verifikasi Password: Bandingkan password dari DTO dengan password (hash) di DB menggunakan bcrypt.compare(). Jika tidak cocok = Throw UnauthorizedException('Invalid credentials').
    const isPasswordMatch = await bcrypt.compare(dto.password, userCheck.password)
    if(!isPasswordMatch) throw new UnauthorizedException("Username atau pasword salah")

    // 3. Generate JWT Tokens: Buat accessToken (misal exp: 15m) dan refreshToken (misal exp: 7d).
    const token = await this.generateToken(userCheck)

    // 4. Hash Refresh Token: Lakukan bcrypt.hash(refreshToken, 10).
    const token_refresh = await bcrypt.hash(token.rt, 10)

    // 5. Update DB via Prisma: Simpan Hash Refresh Token ke field hashedRefreshToken milik user tersebut di database.
    await this.updateRT(userCheck.id, token_refresh)

    const {hashedRT, password, ...data} = userCheck
    
    return {
      data :data,
      token : token
    }

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
