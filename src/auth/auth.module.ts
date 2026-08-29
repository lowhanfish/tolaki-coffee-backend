import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy } from './strategies/at.strategy';
import { AtAuthGuard } from './guards/at.guard';


@Module({
  imports: [
    // JwtModule menyediakan JwtService untuk membuat dan memverifikasi JWT.
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    AtAuthGuard,
  ],
})
export class AuthModule {}
