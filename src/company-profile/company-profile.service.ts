import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto, ReadCompanyDto } from './dto/company-profile.dto';
import { Multer } from 'multer';
import { removeSingleFile } from 'src/common/utils/remove-file';




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
        return data
    }

    async read (query:ReadCompanyDto) {
        const skip = query?.skip ?? 0;
        const limit = query?.limit ?? 100;
        const searchCondition = query.search? 
        {
            OR : [
                {brand : {contains :  query.search, mode : 'insensitive' as const}},
            ]
        }:{}

        const [data, total] = await Promise.all([
            await this.prisma.companyProfile.findMany({
                where : searchCondition,
                skip : skip,
                take : limit,
                orderBy : {
                    createdAt : 'desc'
                }
            }),
            await this.prisma.companyProfile.count({
                where : searchCondition
            })
        ])

        return {
            total : total,
            skip : skip,
            limit : limit,
            data : data
        }
    }

    async readOne (id:string) {
        return id
    }

    async update (id:string, dto:UpdateCompanyDto, file:Express.Multer.File) {
        const {file : newFile, ...newDto} = dto
        const existingData = await this.prisma.companyProfile.findUnique({
            where : {id}
        })

        if(!existingData){
            await removeSingleFile(file.path)
            throw new NotFoundException(`data dengan id : ${id} tidak ditemukan`)
        }

        try {
            const data = await this.prisma.companyProfile.update({
                where : {id},
                data : {
                    ...dto,
                    ...(file? {file : file.filename}: {})
                }
            })

            if(file && existingData.file){
                await removeSingleFile(`./uploads/company/${existingData.file}`)
            }

            return data
            
        } catch (error:any) {
            if(file) await removeSingleFile(file.path)
            throw error
        }



    }

    async delete (id:string) {
        return id
    }   

    


}
