import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
    constructor(
        private prisma : PrismaService
    ){}

    async read(query){

    }
    async readOne(id){

    }
    async create(dto){
        
    }
    async update(id, dto){

    }
    async delete(id){

    }
}
