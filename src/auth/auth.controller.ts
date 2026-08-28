import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto:RegisterDTO){
    return {
      email : dto.email,
      password : dto.password
    }
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto)
  }

  @Post('google')
  google(@Body() dto){
    return {
      message : 'Login From Google',
      status : 200
    }
  }


}
