import { Controller, Post, Get, Patch, Delete, Query, Param, Body } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { Public } from 'src/common/decorators/public.decorator';
import { UploadSingle, UploadMultiple } from 'src/common/decorators/upload-file.decorator';
import { CreateCompanyDto, UpdateCompanyDto, ResponseAllCompanyDto, ResponseOnceCompanyDto, ReadCompanyDto } from './dto/company-profile.dto';






@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Post('create')
  async create(@Body() body:CreateCompanyDto){

  }

  @Get('read')
  @Public()
  async read(@Query() query: ReadCompanyDto){
    return this.companyProfileService.read(query)
  }

  @Get('readOne/:id')
  @Public()
  async readOne(id:string){
    return this.companyProfileService.readOne(id)
  }

  @Patch('update/:id')
  async update(id:string, @Body() body:UpdateCompanyDto){
    return this.companyProfileService.update(id, body)
  }

  @Delete('delete/:id')
  async delete(id:string){
    return this.companyProfileService.delete(id)
  }

}
