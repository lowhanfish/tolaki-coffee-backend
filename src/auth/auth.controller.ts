import { Controller, Post, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './dto/auth.dto';
import type {Response} from "express"


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() dto: AuthLoginDTO) {
    return this.authService.findOne(dto.username)
  }

  @Post('registration')
  async registrasi(@Body() dto : AuthRegisterDTO, @Res({passthrough:true}) res:Response){
    const token = await this.authService.authRegister(dto)

    res.cookie("rt", token.rt, {
      httpOnly: true, // Mencegah pencurian token via JavaScript (XSS)
      secure: process.env.NODE_ENV === 'production', // Wajib HTTPS saat Production
      sameSite: 'lax', // Keamanan CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Hari dalam milidetik
    })

    return {
      message : "Registrasi berhasil",
      access_token : token.at
    }


  }

  
}
