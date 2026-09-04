import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto, ReadCompanyDto } from './dto/company-profile.dto';




@Injectable()
export class CompanyProfileService {
    constructor(
        private prisma : PrismaService
    ){}

    create (dto: CreateCompanyDto) {
        return dto
    }

    read (query:ReadCompanyDto) {
        return query
    }

    readOne (id:string) {
        return id
    }

    update (id:string, dto:UpdateCompanyDto) {
        return dto
    }

    delete (id:string) {
        return id
    }   

    


}
