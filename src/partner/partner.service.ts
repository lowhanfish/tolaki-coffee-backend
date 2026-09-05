import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ReadPartnerDto } from './dto/read-partner.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto, userId: string) {
    return this.prisma.partner.create({
      data: {
        ...createPartnerDto,
        createdBy: userId,
      },
    });
  }

  async findAll(query: ReadPartnerDto) {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 100;
    const where = query?.search
      ? { partner: { contains: query.search } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return { total, skip, limit, data };
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner dengan id ${id} tidak ditemukan`);
    }

    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    try {
      return await this.prisma.partner.update({
        where: { id },
        data: updatePartnerDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Partner dengan id ${id} tidak ditemukan`);
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.partner.delete({ where: { id } });
      return { message: `Partner dengan id ${id} berhasil dihapus` };
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Partner dengan id ${id} tidak ditemukan`);
      }

      throw error;
    }
  }
}
