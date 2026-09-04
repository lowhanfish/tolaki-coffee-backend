import { Controller, Post, Get, Patch, Delete, Query, Param, Body, UploadedFile } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { Public } from 'src/common/decorators/public.decorator';
import { UploadSingle, UploadMultiple } from 'src/common/decorators/upload-file.decorator';
import { CreateCompanyDto, UpdateCompanyDto, ResponseAllCompanyDto, ResponseOnceCompanyDto, ReadCompanyDto } from './dto/company-profile.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorators/get-current-user.decorator';






@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/company')
  async create(
    @Body() body:CreateCompanyDto, 
    @UploadedFile() file:Express.Multer.File,
    @GetCurrentUser('userId') userId:string
  ):Promise<ResponseOnceCompanyDto>{
    return this.companyProfileService.create(body, file, userId)
  }

  @Get('read')
  @Public()
  async read(@Query() query: ReadCompanyDto):Promise<ResponseAllCompanyDto>{
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
