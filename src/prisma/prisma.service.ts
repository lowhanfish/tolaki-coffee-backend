
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({ 
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root', // Masukkan password MySQL/MariaDB kamu di sini
        database: process.env.DB_NAME || 'kopi_tolaki',
        connectionLimit: 5,
    });
    super({ adapter });
  }

  async OnModuleInit(){
    await this.$connect();
  }
  async OnModuleDestroy(){
    await this.$disconnect();
  }

}
