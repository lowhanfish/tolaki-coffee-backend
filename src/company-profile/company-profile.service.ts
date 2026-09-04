import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto, ReadCompanyDto } from './dto/company-profile.dto';




@Injectable()
export class CompanyProfileService {
    constructor(
        private prisma : PrismaService
    ){}

    async create (dto: CreateCompanyDto, file:Express.Multer.File, userId:string) {
        const data = await this.prisma.companyProfile.create({
            data : {
                ...dto,
                file : file?.filename ?? null,
                createdBy : userId
            }
        })

        if(!data){
            throw new Error('')
        }
        return data
    }

    async read (query:ReadCompanyDto) {
        return query
    }

    async readOne (id:string) {
        return id
    }

    async update (id:string, dto:UpdateCompanyDto) {
        return dto
    }

    async delete (id:string) {
        return id
    }   

    


}
