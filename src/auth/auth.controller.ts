import { Controller, Post, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() dto: AuthLoginDTO) {
    return this.authService.findOne(dto.username)
  }

  @Post('registration')
  registrasi(@Body() body : AuthRegisterDTO){
    return "Hy saya dari body"
  }

  
}
