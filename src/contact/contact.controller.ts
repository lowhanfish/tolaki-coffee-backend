import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, ReadAllContactDto, ResponseContactDto, ResponseContactOnceDto } from './dto/contact.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';



@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('create')
  async create(@Body() createContactDto: CreateContactDto): Promise<ResponseContactOnceDto> {
    return this.contactService.create(createContactDto);
  }

  @Get('read')
  @Public()
  async findAll(@Query() query:ReadAllContactDto):Promise<ResponseContactDto> {
    return this.contactService.findAll(query);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateContactDto:UpdateContactDto): Promise<ResponseContactOnceDto> {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.contactService.delete(id);
  }

  @Get('readOne/:id')
  @Public()
  async findOne(@Param('id') id: string):Promise<ResponseContactOnceDto> {
    return this.contactService.findOne(id);
  }

}
