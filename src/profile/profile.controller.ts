import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadSingle, UploadMultiple } from 'src/common/decorators/upload-file.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { createProfile } from './swagger/profile.swagger';





@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({schema : createProfile})
  @Public()
  @UploadSingle('file', './uploads/aaa')
  create(@UploadedFile() file: Express.Multer.File, @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto, file);
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
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
