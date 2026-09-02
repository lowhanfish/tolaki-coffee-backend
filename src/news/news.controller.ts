import { Controller, Post, Get, Patch, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  
  

}
