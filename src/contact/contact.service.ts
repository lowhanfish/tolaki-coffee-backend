import { Injectable } from '@nestjs/common';
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


  create(dto:CreateContactDto) {
    const query = this.prisma.contact.create({
      data : {
        storeName : dto.storeName,
        address : dto.address,
        phone : dto.phone,
        email : dto.email,
        mapsUrl : dto.mapsUrl,
        openHours : dto.openHours,
        instagram : dto.instagram,
        facebook : dto.facebook,
        tiktok : dto.tiktok,
        tokopedia : dto.tokopedia,
        shopee : dto.shopee,
      }
    })

    console.log(query)

    return query


  }

  findAll() {
    return {
      total : 100,
      skip : 1,
      limit : 8,
      data : [response]
    };
  }

  findOne(id: number) {
    return response;
  }

  update(id: string, updateContactDto:UpdateContactDto) {
    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
