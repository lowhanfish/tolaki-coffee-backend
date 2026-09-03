import { Controller, Post, Get, Patch, Delete, Body, Query, Param } from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateNewsDto, ReadNewsDto, UpdateNewsDto, ResponseOnceNewsDto, ResponseAllNewsDto } from './dto/news.dto';
import { ApiProperty } from '@nestjs/swagger';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  @Public()
  async create(@Body() dto:CreateNewsDto){
    return this.newsService.create(dto)
  }
  @Get('read')
  @Public()
  async read(@Body() query:ReadNewsDto){
    return this.newsService.read(query)
  }

  @Get('readOne/:id')
  @Public()
  async readOne(@Param('id') id:string){
    return this.newsService.readOne(id)
  }

  @Patch('update/:id')
  @Public()
  async update(@Param('id') id:string, @Body() dto:UpdateNewsDto){
    return this.newsService.update(id, dto)
  }

  @Delete('delete/:id')
  @Public()
  async delete(@Param('id') id:string){
    return this.newsService.delete(id)
  }
  

}
