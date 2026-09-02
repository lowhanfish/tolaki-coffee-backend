import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/profile.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { createProfile } from './swagger/profile.swagger';


import { UploadAndSavePolymorphic, UploadMultipleAndSavePolymorphic } from 'src/common/decorators/upload-polymorphic.decorator';


@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema : createProfile})
  @Public()
  @UploadAndSavePolymorphic('profile', 'file', './uploads/aaa')
  create(@UploadedFile() file: Express.Multer.File, @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: CreateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }


}
