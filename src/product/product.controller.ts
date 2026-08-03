import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import 'multer'; // This is needed for Express.Multer.File types
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // 'files' adalah nama field di form-data, 10 adalah jumlah maksimal file
      storage: diskStorage({
        destination: './uploads/products', // Pastikan direktori ini ada
        filename: (req, file, cb) => {
          // Membuat nama file acak untuk menghindari duplikasi
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Filter yang lebih andal dengan memeriksa MIME type
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Hanya file gambar yang diizinkan! (jpg, png, gif, etc.)'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data produk dan file gambar (maksimal 10 file)',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Kopi Robusta Tolaki' },
        price: { type: 'number', example: 50000 },
        unit_price: { type: 'string', example: '250 gram' },
        description: { type: 'string', example: 'Biji kopi robusta pilihan dari pegunungan Tolaki.' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'File gambar produk.',
        },
      },
      required: ['title', 'price', 'unit_price', 'files'],
    },
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productService.create(createProductDto, files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
