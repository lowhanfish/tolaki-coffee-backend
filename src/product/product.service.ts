import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import 'multer'; // This is needed for Express.Multer.File types

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Setidaknya harus ada satu file gambar yang diupload.',
      );
    }

    // Gunakan transaksi untuk memastikan integritas data
    return this.prisma.$transaction(async (tx) => {
      // 1. Buat entri produk di database
      const product = await tx.product.create({
        data: {
          ...createProductDto,
        },
      });

      // 2. Siapkan data file untuk dimasukkan secara batch, dengan relasi generik
      const filesToCreate = files.map((file) => ({
        title: file.filename, // Gunakan nama file yang sudah di-generate
        type: file.mimetype,
        table_name: 'Product', // Menunjukkan file ini milik tabel 'Product'
        table_id: product.id, // ID dari produk yang baru dibuat
      }));

      // 3. Masukkan semua data file ke database
      await tx.file.createMany({
        data: filesToCreate,
      });

      // 4. Kembalikan data produk lengkap dengan file-filenya (ambil file secara terpisah)
      const productWithFiles = await tx.product.findUnique({
        where: { id: product.id },
      });

      const associatedFiles = await tx.file.findMany({
        where: {
          table_name: 'Product',
          table_id: product.id,
        },
      });

      return { ...productWithFiles, files: associatedFiles };
    });
  }

  findAll() {
    return this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany();
      const files = await tx.file.findMany({
        where: { table_name: 'Product' },
      });

      // Map files to their respective products
      return products.map((product) => ({
        ...product,
        files: files.filter((file) => file.table_id === product.id),
      }));
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Produk dengan ID "${id}" tidak ditemukan`);
    }

    const associatedFiles = await this.prisma.file.findMany({
      where: {
        table_name: 'Product',
        table_id: product.id,
      },
    });

    return { ...product, files: associatedFiles };
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Hapus file-file yang terkait dengan produk ini terlebih dahulu
      await tx.file.deleteMany({
        where: {
          table_name: 'Product',
          table_id: id,
        },
      });

      // 2. Kemudian hapus produknya
      return tx.product.delete({
        where: { id },
      });
    });
  }
}
