import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PartnershipStandardService } from './partnership-standard.service';
import {
  CreatePartnershipStandardDto,
  ReadAllPartnershipStandardDto,
  ResponsePartnershipStandardDto,
  ResponsePartnershipStandardOnceDto,
  UpdatePartnershipStandardDto,
} from './dto/partnership-standard.dto';
import { Public } from '../common/decorators/public.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('partnership-standard')
export class PartnershipStandardController {
  constructor(private readonly partnershipStandardService: PartnershipStandardService) {}

  @Post('create')
  async create(
    @Body() createPartnershipStandardDto: CreatePartnershipStandardDto,
    @GetCurrentUser('userId') userId: string,
  ): Promise<ResponsePartnershipStandardOnceDto> {
    return this.partnershipStandardService.create(createPartnershipStandardDto, userId);
  }

  @Get('read')
  @Public()
  async findAll(
    @Query() query: ReadAllPartnershipStandardDto,
  ): Promise<ResponsePartnershipStandardDto> {
    return this.partnershipStandardService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePartnershipStandardDto: UpdatePartnershipStandardDto,
  ): Promise<ResponsePartnershipStandardOnceDto> {
    return this.partnershipStandardService.update(id, updatePartnershipStandardDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.partnershipStandardService.delete(id);
  }

  @Get('readOne/:id')
  @Public()
  async findOne(@Param('id') id: string): Promise<ResponsePartnershipStandardOnceDto> {
    return this.partnershipStandardService.findOne(id);
  }
}
