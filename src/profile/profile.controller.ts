import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { UploadSingle } from '../common/decorators/upload-file.decorator';
import {
  CreateProfileDto,
  ReadProfileDto,
  ResponseAllProfileDto,
  ResponseProfileDto,
  UpdateProfileDto,
} from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/profile')
  create(
    @Body() dto: CreateProfileDto,
    @GetCurrentUser('userId') userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseProfileDto> {
    return this.profileService.create(dto, userId, file);
  }

  @Get('read')
  findAll(@Query() query: ReadProfileDto): Promise<ResponseAllProfileDto> {
    return this.profileService.findAll(query);
  }

  @Get('me')
  findCurrent(
    @GetCurrentUser('userId') userId: string,
  ): Promise<ResponseProfileDto> {
    return this.profileService.findCurrent(userId);
  }

  @Get('readOne/:id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser('userId') userId: string,
  ): Promise<ResponseProfileDto> {
    return this.profileService.findOne(id, userId);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/profile')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
    @GetCurrentUser('userId') userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponseProfileDto> {
    return this.profileService.update(id, dto, userId, file);
  }

  @Delete('delete/:id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.profileService.remove(id, userId);
  }
}
