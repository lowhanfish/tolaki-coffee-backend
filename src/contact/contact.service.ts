import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';


const response = {
    id : "",
    storeName : "",
    address : "",
    phone : "",
    email : "",
    mapsUrl : "",
    openHours : "",
    instagram : "",
    facebook : "",
    tiktok : "",
    tokopedia : "",
    shopee : "",
}


@Injectable()
export class ContactService {

  constructor(
    private prisma : PrismaService
  ){}


  async create(dto:CreateContactDto) {
    const query = await this.prisma.contact.create({
      data : dto
    })
    return query
  }

  async findAll(query) {

    const skip = Number(query?.skip?? 0)
    const limit = Number(query?.limit?? 100)

    const searchCondititon = query.search ?
    {
      OR : [
        {storeName : {contains : query.search, mode : 'insensitive' as const}},
      ]
    } :{}

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where : searchCondititon,
        skip : skip,
        take : limit,
        orderBy : {
          createdAt : 'desc'
        }
      })
      ,
      this.prisma.contact.count({
        where : searchCondititon,
      })
    ])

    return {
      total : total,
      skip : skip,
      limit : limit,
      data : data
    };
  }

  async findOne(id: string) {
    const query = await this.prisma.contact.findUnique({
      where : {id}
    });
    if (!query) {
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }
    return query
  }

  async update(id: string, dto:UpdateContactDto) {
    try {
      const query = await this.prisma.contact.update({
        where : {id},
        data : dto
      })
      return query
    } catch (error:any) {
      if(error?.code == 'P2025'){
        throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`)
      }
      throw error
    }
  }

  async delete(id: string) {

    try {
      await this.prisma.contact.delete({
        where : {id},
      })
      return { message: `Data dengan id : ${id} berhasil dihapus..!` };
    } catch (error:any) {
      if(error?.code == 'P2025') throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`)
        throw error
    }
  }



}
