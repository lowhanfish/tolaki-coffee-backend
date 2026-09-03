import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UploadedFile } from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';
import { CreateNewsDto, ReadNewsDto, UpdateNewsDto, ResponseOnceNewsDto, ResponseAllNewsDto } from './dto/news.dto';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { UploadSingle, UploadMultiple } from 'src/common/decorators/upload-file.decorator';



@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/news')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateNewsDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.newsService.create(file, dto, userId);
  }
  @Get('read')
  async read(@Query() query:ReadNewsDto){
    return this.newsService.read(query)
  }

  @Get('readOne/:id')
  @Public()
  async readOne(@Param('id') id:string){
    return this.newsService.readOne(id)
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/news')
  async update(@Param('id') id:string, @Body() dto:UpdateNewsDto, @UploadedFile() file?:Express.Multer.File){
    return this.newsService.update(id, dto, file)
  }

  @Delete('delete/:id')
  @Public()
  async delete(@Param('id') id:string){
    return this.newsService.delete(id)
  }
  

}
