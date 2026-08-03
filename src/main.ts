import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common'
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Gunakan middleware cookie-parser
  app.useGlobalPipes(new ValidationPipe({
    whitelist :true,
    forbidNonWhitelisted : true,
    transform : true
  }));

  const config = new DocumentBuilder()
    .setTitle('Kopi Tolaki')
    .setDescription('Kopi Tolaki API description')
    .setVersion('1.0')
    .addTag('Kopi Tolaki')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Masukkan Access Token di sini',
        in: 'header',
      },
      'access-token', // 👈 nama acuan/key untuk Security
    )
    .addSecurityRequirements('access-token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
