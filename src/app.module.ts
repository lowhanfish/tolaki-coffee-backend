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


@Module({
  imports: [AuthModule, PrismaModule, ContactModule, NewsModule, PartnerModule, ProductModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
