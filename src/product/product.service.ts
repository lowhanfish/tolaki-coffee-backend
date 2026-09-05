import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { removeSingleFile } from '../common/utils/remove-file';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const PRODUCT_TABLE_NAME = 'product';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateProductDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const { files: _files, ...productData } = dto;
    const product = await this.prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: { ...productData, createdBy: userId },
      });
      if (files?.length) {
        await tx.file.createMany({
          data: files.map((file) => ({
            title: file.filename,
            type: file.mimetype,
            path: file.path,
            table_name: PRODUCT_TABLE_NAME,
            table_id: createdProduct.id,
            createdBy: userId,
          })),
        });
      }
      return createdProduct;
    });
    return this.findOne(product.id);
  }

  async findAll(query: ReadProductDto) {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 100;
    const where = query?.search
      ? {
          OR: [
            { title: { contains: query.search } },
            { description: { contains: query.search } },
            { unit_price: { contains: query.search } },
          ],
        }
      : {};
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);
    const files = products.length
      ? await this.prisma.file.findMany({
          where: {
            table_name: PRODUCT_TABLE_NAME,
            table_id: { in: products.map((p) => p.id) },
          },
          orderBy: { createdAt: 'desc' },
        })
      : [];
    const data = products.map((product) => ({
      ...product,
      files: files.filter((file) => file.table_id === product.id),
    }));
    return { total, skip, limit, data };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    const files = await this.prisma.file.findMany({
      where: { table_name: PRODUCT_TABLE_NAME, table_id: id },
      orderBy: { createdAt: 'desc' },
    });
    return { ...product, files };
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      const { files: _files, ...productData } = dto;
      return await this.prisma.product.update({
        where: { id },
        data: productData,
      });
    } catch (error: any) {
      if (error?.code === 'P2025')
        throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
      throw error;
    }
  }

  async addPhotos(id: string, files: Express.Multer.File[], userId: string) {
    await this.ensureProductExists(id, files);
    if (!files?.length) return this.findOne(id);
    await this.prisma.file.createMany({
      data: files.map((file) => ({
        title: file.filename,
        type: file.mimetype,
        path: file.path,
        table_name: PRODUCT_TABLE_NAME,
        table_id: id,
        createdBy: userId,
      })),
    });
    return this.findOne(id);
  }

  async deletePhoto(fileId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, table_name: PRODUCT_TABLE_NAME },
    });
    if (!file)
      throw new NotFoundException(`Foto dengan id : ${fileId} tidak ditemukan`);
    await this.prisma.file.delete({ where: { id: fileId } });
    await removeSingleFile(file.path);
    return { message: `Foto dengan id : ${fileId} berhasil dihapus..!` };
  }

  async deletePhotos(fileIds: string[]) {
    const files = await this.prisma.file.findMany({
      where: { id: { in: fileIds }, table_name: PRODUCT_TABLE_NAME },
    });
    if (files.length !== fileIds.length)
      throw new NotFoundException('Satu atau beberapa foto tidak ditemukan');
    await this.prisma.file.deleteMany({
      where: { id: { in: fileIds }, table_name: PRODUCT_TABLE_NAME },
    });
    await Promise.all(files.map((file) => removeSingleFile(file.path)));
    return { message: `${files.length} foto berhasil dihapus..!` };
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product)
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    const files = await this.prisma.file.findMany({
      where: { table_name: PRODUCT_TABLE_NAME, table_id: id },
    });
    await this.prisma.$transaction([
      this.prisma.file.deleteMany({
        where: { table_name: PRODUCT_TABLE_NAME, table_id: id },
      }),
      this.prisma.product.delete({ where: { id } }),
    ]);
    await Promise.all(files.map((file) => removeSingleFile(file.path)));
    return { message: `Data dengan id : ${id} berhasil dihapus..!` };
  }

  private async ensureProductExists(id: string, files?: Express.Multer.File[]) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      await Promise.all(
        (files ?? []).map((file) => removeSingleFile(file.path)),
      );
      throw new NotFoundException(`Data dengan id : ${id} tidak ditemukan`);
    }
  }
}
