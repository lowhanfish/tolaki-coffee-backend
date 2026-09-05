import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductFilesDto } from './dto/delete-product-files.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { UploadMultiple } from '../common/decorators/upload-file.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UploadMultiple('files', 20, './uploads/product')
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.productService.create(dto, files, userId);
  }

  @Get('read')
  @Public()
  findAll(@Query() query: ReadProductDto) {
    return this.productService.findAll(query);
  }

  @Get('readOne/:id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }

  @Post('add-photo/:id')
  @ApiConsumes('multipart/form-data')
  @UploadMultiple('files', 20, './uploads/product')
  addPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.productService.addPhotos(id, files, userId);
  }

  @Delete('delete-photo/:fileId')
  deletePhoto(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return this.productService.deletePhoto(fileId);
  }

  @Delete('delete-photos')
  deletePhotos(@Body() dto: DeleteProductFilesDto) {
    return this.productService.deletePhotos(dto.fileIds);
  }
}
