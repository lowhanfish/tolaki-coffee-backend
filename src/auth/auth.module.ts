import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // JwtModule menyediakan JwtService untuk membuat dan memverifikasi JWT.
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
