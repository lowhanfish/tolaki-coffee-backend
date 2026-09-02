import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
    constructor(
        private prisma : PrismaService
    ){}

    async read(){

    }
    async readOne(){

    }
    async create(){
        
    }
    async update(){

    }
    async delete(){

    }
}
