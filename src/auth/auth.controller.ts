import { Controller, Post, Body, Res, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './dto/auth.dto';
import type {Response} from "express"


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() dto: AuthLoginDTO, @Res() res:Response) {
    const {data, token} = await this.authService.authLogin(dto)
    await this.resCookie(res, token.rt)

    return {
      data : data,
      at : token.at 
    };
  }

  @Post('registration')
  async registrasi(@Body() dto : AuthRegisterDTO, @Res({passthrough:true}) res:Response){
    const token = await this.authService.authRegister(dto)
    await this.resCookie(res, token.rt)
    return {
      message : "Registrasi berhasil",
      access_token : token.at
    }


  }

  // Helper res cookies untuk refresh token
  async resCookie(res:Response, rt:string){
    res.cookie('rt', rt, {
      httpOnly : true,
      secure : process.env.NODE_ENV === 'production',
      sameSite : 'lax',
      maxAge : 7 * 24 * 60 * 60 * 1000
    })
  }

  
}
