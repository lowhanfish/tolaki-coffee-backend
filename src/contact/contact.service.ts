import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  findAll() {
    return this.prisma.contact.findMany();
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Kontak dengan ID "${id}" tidak ditemukan.`);
    }
    return contact;
  }

  async findMain() {
    const contact = await this.prisma.contact.findFirst();
    if (!contact) {
      throw new NotFoundException(
        'Profil kontak utama belum dibuat.',
      );
    }
    return contact;
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: string) {
    // Pastikan data ada sebelum dihapus
    await this.findOne(id);
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}