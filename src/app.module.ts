import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { NewsModule } from './news/news.module';
import { PartnerModule } from './partner/partner.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';


import { ConfigModule } from '@nestjs/config';

import {APP_GUARD} from '@nestjs/core'
import { AtGuard } from './auth/guards/at.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 1. Tambahkan ini di imports agar env terbaca di seluruh modul
    }),
    AuthModule, 
    PrismaModule, 
    ContactModule, 
    NewsModule, 
    PartnerModule, 
    ProductModule, 
    ProfileModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard, // 👈 Pasang AtGuard sebagai Guard Global seluruh aplikasi
    },
  ],
})
export class AppModule {}
