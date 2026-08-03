import { Controller, Post, Body, Res, Get, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './dto/auth.dto';
import type {Response, Request} from "express"
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/public.decorator';
import { GetCurrentUser } from './get-current-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async create(@Body() dto: AuthLoginDTO, @Res({passthrough:true}) res:Response) {
    const {data, token} = await this.authService.authLogin(dto)
    await this.resCookie(res, token.rt)

    return {
      data : data,
      at : token.at 
    };
  }

  @Public()
  @Post('registration')
  async registrasi(@Body() dto : AuthRegisterDTO, @Res({passthrough:true}) res:Response){
    const token = await this.authService.authRegister(dto)
    await this.resCookie(res, token.rt)
    return {
      message : "Registrasi berhasil",
      access_token : token.at
    }
  }

  @UseGuards(AuthGuard('jwt-at'))
  @Get('profile')
  async getProfile(@GetCurrentUser('sub') userId: string) {
    return this.authService.authGetProfile(userId);
  }

  @Public() // Bypass the global AT Guard
  @UseGuards(AuthGuard('jwt-refresh')) // Use the specific RT Guard
  @Post('refresh')
  async refreshToken(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({passthrough:true}) res:Response
  ) {
    const newTokens = await this.authService.authRefreshToken(userId, refreshToken);
    await this.resCookie(res, newTokens.rt);
    return { at: newTokens.at };
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
