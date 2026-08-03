import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';
import 'multer';
import * as fs from 'fs';
import { join } from 'path'; // Import join from path
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  create(createNewsDto: CreateNewsDto, file: Express.Multer.File) {
    const dataToCreate: any = {
      ...createNewsDto,
    };

    if (file) {
      dataToCreate.file = file.filename; // KUNCI: Hanya menggunakan nama file, bukan path
    }
    return this.prisma.news.create({
      data: dataToCreate,
    });
  }

  findAll() {
    return this.prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });
    if (!news) {
      throw new NotFoundException(`Berita dengan ID "${id}" tidak ditemukan`);
    }
    return news;
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    file: Express.Multer.File,
  ) {
    const existingNews = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      if (file) {
        // Jika berita tidak ditemukan, tapi ada file baru terlanjur diupload,
        // hapus file yatim tersebut untuk menjaga kebersihan.
        try {
          await unlinkAsync(file.path);
        } catch (err) {
          // Log error jika gagal, tapi jangan hentikan proses utama
          console.error(`Gagal menghapus file yang terlanjur diupload: ${file.path}`, err);
        }
      }
      throw new NotFoundException(`Berita dengan ID "${id}" tidak ditemukan`);
    }

    const dataToUpdate: any = {
      ...updateNewsDto,
    };

    if (file) {
      dataToUpdate.file = file.filename; // KUNCI: Hanya menggunakan nama file, bukan path
    }

    const updatedNews = await this.prisma.news.update({
      where: { id },
      data: dataToUpdate,
    });

    // Jika file baru diupload dan ada file lama, hapus file lama
    if (file && existingNews.file) {
      const oldFilePath = join('./uploads/news', existingNews.file); // Rekonstruksi jalur lengkap
      try {
        await unlinkAsync(oldFilePath);
      } catch (err) {
        console.error(`Gagal menghapus file lama: ${oldFilePath}`, err);
      }
    }

    return updatedNews;
  }

  async remove(id: string) {
    const newsToDelete = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!newsToDelete) {
      throw new NotFoundException(`Berita dengan ID "${id}" tidak ditemukan`);
    }

    // Hapus record dari database
    const result = await this.prisma.news.delete({
      where: { id },
    });

    // Jika ada file terkait, hapus dari filesystem
    if (newsToDelete.file) {
      const filePathToDelete = join('./uploads/news', newsToDelete.file); // Rekonstruksi jalur lengkap
      try {
        await unlinkAsync(filePathToDelete);
      } catch (err) {
        console.error(`Gagal menghapus file terkait: ${filePathToDelete}`, err);
      }
    }

    return result;
  }
}