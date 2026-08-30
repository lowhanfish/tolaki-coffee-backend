import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { PartnerModule } from './partner/partner.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';

import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import {APP_GUARD} from '@nestjs/core'
import { AtAuthGuard } from './auth/guards/at.guard';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 1. Tambahkan ini di imports agar env terbaca di seluruh modul
    }),
    PrismaModule, 
    AuthModule,
    NewsModule, 
    PartnerModule, 
    ProductModule, 
    ProfileModule, ContactModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_GUARD,
      useClass : AtAuthGuard
    }
  ],
})
export class AppModule {}
