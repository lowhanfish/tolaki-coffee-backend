import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { removeSingleFile } from '../common/utils/remove-file';
import {
  CreateStoryFromGardenDto,
  ReadStoryFromGardenDto,
  UpdateStoryFromGardenDto,
} from './dto/story-from-garden.dto';

@Injectable()
export class StoryFromGardenService {
  constructor(private readonly prisma: PrismaService) {}

  async read(query: ReadStoryFromGardenDto) {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 100;
    const where = query?.search
      ? {
          OR: [
            { title: { contains: query.search } },
            { news: { contains: query.search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.storiesFromGarden.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.storiesFromGarden.count({ where }),
    ]);

    return { total, skip, limit, data };
  }

  async readOne(id: string) {
    const data = await this.prisma.storiesFromGarden.findUnique({ where: { id } });

    if (!data) {
      throw new NotFoundException(`Data dengan id ${id} tidak ditemukan`);
    }

    return data;
  }

  async create(file: Express.Multer.File, dto: CreateStoryFromGardenDto, userId: string) {
    if (!file) {
      throw new BadRequestException('File wajib diunggah');
    }

    const { file: _file, ...storyData } = dto;
    return this.prisma.storiesFromGarden.create({
      data: {
        ...storyData,
        file: file.filename,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateStoryFromGardenDto, file?: Express.Multer.File) {
    const { file: _file, ...storyData } = dto;
    const existing = await this.prisma.storiesFromGarden.findUnique({ where: { id } });

    if (!existing) {
      if (file) await removeSingleFile(file.path);
      throw new NotFoundException(`Data dengan id ${id} tidak ditemukan`);
    }

    try {
      const data = await this.prisma.storiesFromGarden.update({
        where: { id },
        data: {
          ...storyData,
          ...(file ? { file: file.filename } : {}),
        },
      });

      if (file) {
        await removeSingleFile(`./uploads/story-from-garden/${existing.file}`);
      }

      return data;
    } catch (error) {
      if (file) await removeSingleFile(file.path);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.prisma.storiesFromGarden.delete({ where: { id } });
      await removeSingleFile(`./uploads/story-from-garden/${deleted.file}`);
      return { message: `Data dengan id ${id} berhasil dihapus` };
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Data dengan id ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
