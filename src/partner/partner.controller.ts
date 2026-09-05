import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ReadPartnerDto } from './dto/read-partner.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('create')
  create(
    @Body() createPartnerDto: CreatePartnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.partnerService.create(createPartnerDto, userId);
  }

  @Get()
  @Public()
  findAll(@Query() query: ReadPartnerDto) {
    return this.partnerService.findAll(query);
  }

  @Get('readOne/:id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partnerService.findOne(id);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partnerService.remove(id);
  }
}
