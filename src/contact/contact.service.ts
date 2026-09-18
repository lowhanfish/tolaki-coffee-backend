import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto, UpdateContactDto, CreateInquiryDto } from './dto/contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto, userId: string) {
    let companyProfileId = dto.companyProfileId;
    if (!companyProfileId) {
      const comp =
        (await this.prisma.companyProfile.findFirst({
          where: { createdBy: userId },
        })) || (await this.prisma.companyProfile.findFirst());
      if (!comp) {
        throw new NotFoundException('Silakan buat profil perusahaan terlebih dahulu.');
      }
      companyProfileId = comp.id;
    }

    return this.prisma.contact.create({
      data: {
        ...dto,
        companyProfileId,
        createdBy: userId,
      },
    });
  }

  async findAll(query: any) {
    const skip = Number(query?.skip ?? 0);
    const limit = Number(query?.limit ?? 100);

    const searchCondition = query?.search
      ? {
          OR: [
            { storeName: { contains: query.search } },
            { address: { contains: query.search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where: searchCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.contact.count({
        where: searchCondition,
      }),
    ]);

    return {
      total,
      skip,
      limit,
      data,
    };
  }

  async findOne(id: string) {
    const query = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!query) {
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }
    return query;
  }

  async update(id: string, dto: UpdateContactDto) {
    try {
      return await this.prisma.contact.update({
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
      await this.prisma.contact.delete({
        where: { id },
      });
      return { message: `Data dengan id : ${id} berhasil dihapus..!` };
    } catch (error: any) {
      if (error?.code === 'P2025')
        throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
      throw error;
    }
  }

  // Inquiries from visitors
  async createInquiry(dto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: dto,
    });
  }

  async findAllInquiries() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteInquiry(id: string) {
    try {
      await this.prisma.inquiry.delete({ where: { id } });
      return { message: `Pesan berhasil dihapus` };
    } catch (error: any) {
      if (error?.code === 'P2025')
        throw new NotFoundException(`Pesan tidak ditemukan`);
      throw error;
    }
  }
}
