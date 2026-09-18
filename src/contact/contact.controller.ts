import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto, ReadAllContactDto, ResponseContactDto, ResponseContactOnceDto, CreateInquiryDto } from './dto/contact.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('create')
  async create(
    @Body() createContactDto: CreateContactDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<any> {
    return this.contactService.create(createContactDto, userId);
  }

  @Get('read')
  @Public()
  async findAll(@Query() query: ReadAllContactDto): Promise<ResponseContactDto> {
    return this.contactService.findAll(query);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto): Promise<any> {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.contactService.delete(id);
  }

  @Get('readOne/:id')
  @Public()
  async findOne(@Param('id') id: string): Promise<any> {
    return this.contactService.findOne(id);
  }

  // Inquiry endpoints
  @Post('send-message')
  @Public()
  async sendMessage(@Body() dto: CreateInquiryDto) {
    return this.contactService.createInquiry(dto);
  }

  @Get('messages')
  async getMessages() {
    return this.contactService.findAllInquiries();
  }

  @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string) {
    return this.contactService.deleteInquiry(id);
  }
}
