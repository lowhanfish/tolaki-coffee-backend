import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDTO) {
    return {
      email : body.email,
      password : body.password
    }
  }

  @Post('register')
  register(@Body() body:RegisterDTO){
    return {
      email : body.email,
      password : body.password
    }
  }


}
