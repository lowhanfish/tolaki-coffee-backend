import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePartnershipStandardDto,
  ReadAllPartnershipStandardDto,
  UpdatePartnershipStandardDto,
} from './dto/partnership-standard.dto';

@Injectable()
export class PartnershipStandardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePartnershipStandardDto, userId: string) {
    return this.prisma.partnertshipStandard.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });
  }

  async findAll(query: ReadAllPartnershipStandardDto) {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 100;
    const where = query?.search
      ? {
          OR: [
            { title: { contains: query.search } },
            { description: { contains: query.search } }
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.partnertshipStandard.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partnertshipStandard.count({ where }),
    ]);

    return { total, skip, limit, data };
  }

  async findOne(id: string) {
    const data = await this.prisma.partnertshipStandard.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }

    return data;
  }

  async update(id: string, dto: UpdatePartnershipStandardDto) {
    try {
      return await this.prisma.partnertshipStandard.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.partnertshipStandard.delete({ where: { id } });
      return { message: `Data dengan id : ${id} berhasil dihapus..!` };
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
