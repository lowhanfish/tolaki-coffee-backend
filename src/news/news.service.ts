import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto, UpdateNewsDto, ReadNewsDto } from './dto/news.dto';
import { removeSingleFile } from 'src/common/utils/remove-file';


@Injectable()
export class NewsService {
    constructor(
        private prisma : PrismaService
    ){}

    async read(query:ReadNewsDto){
        const skip = Number(query?.skip ?? 0)
        const limit = Number(query?.limit ?? 100)

        const searchCondition =  query.search? {
            OR : [
                {title : query.search, mode : "insensitive" as const},
                {description : query.search, mode : "insensitive" as const},
            ]
        }:{}

        const [data, total] = await Promise.all([
            await this.prisma.news.findMany({
                where : searchCondition,
                skip : skip,
                take : limit
            }),
            await this.prisma.news.count({
                where : searchCondition
            })
        ])
        return {
            total : total,
            skip : skip,
            limit : limit,
            data : data
        };

    }
    async readOne(id:string){
        try {
            const data = await this.prisma.news.findUnique({
                where : {id}
            })
            return data
        } catch (error:any) {
            if(error.code == 'P2025') throw new NotFoundException(`data dengan id : ${id} tidak ditemukan...!`)
            throw error
        }
    }

    async create(file: Express.Multer.File, dto: CreateNewsDto, userId: string){
        const { file: _file, ...newsData } = dto;
        const data = await this.prisma.news.create({
            data : {
                ...newsData,
                file : file?.filename ?? null,
                createdBy: userId,
            }
        })
        return data
    }

    async update(id: string, dto: UpdateNewsDto, file?: Express.Multer.File) {
        const { file: newFile, ...newDto } = dto;

        // 1. Cek keberadaan data
        const dataExist = await this.prisma.news.findUnique({
            where: { id },
        });

        // Jika ID tidak ditemukan, hapus file baru yang baru saja di-upload Multer
        if (!dataExist) {
            if (file) await removeSingleFile(file.path);
            throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
        }

        try {
            // 2. Eksekusi Update ke Database
            const data = await this.prisma.news.update({
            where: { id },
            data: {
                ...newDto,
                ...(file ? { file: file.filename } : {}),
            },
            });

            // 3. Hapus file lama SETELAH update DB dipastikan berhasil
            if (file && dataExist.file) {
                await removeSingleFile(`./uploads/news/${dataExist.file}`);
            }

            return data;
        } catch (error) {
            // Jika update DB gagal, hapus file baru agar tidak jadi sampah
            if (file) await removeSingleFile(file.path);
            throw error;
        }
    }

    async delete(id : string){
        try {
            const deleteData = await this.prisma.news.delete({
                where : {id}
            })
            if(deleteData.file) await removeSingleFile(`./uploads/news/${deleteData.file}`)
            return {message : `Data dengan id : ${id} berhasil dihapus`}
        } catch (error:any) {
            if(error?.code == "P2025") throw new NotFoundException(`Data dengan id : ${id} tidak di temukan`)
            throw error
        }
    }
}
