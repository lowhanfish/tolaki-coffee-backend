import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ProfileService {

  constructor(
    private prisma : PrismaService
  ){}


async create(createProfileDto: CreateProfileDto) {
  // const profile = await this.prisma.profile.create({
  //   data: createProfileDto,
  // });

  // // Wajib ada return ini agar Interceptor bisa membaca profile.id
  // return profile;

  return createProfileDto
}

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: CreateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
