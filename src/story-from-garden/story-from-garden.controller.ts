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
import { StoryFromGardenService } from './story-from-garden.service';
import { Public } from '../common/decorators/public.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import {
  CreateStoryFromGardenDto,
  ReadStoryFromGardenDto,
  UpdateStoryFromGardenDto,
} from './dto/story-from-garden.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadSingle } from '../common/decorators/upload-file.decorator';

@Controller('story-from-garden')
export class StoryFromGardenController {
  constructor(private readonly storyFromGardenService: StoryFromGardenService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/story-from-garden')
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateStoryFromGardenDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.storyFromGardenService.create(file, dto, userId);
  }

  @Get('read')
  read(@Query() query: ReadStoryFromGardenDto) {
    return this.storyFromGardenService.read(query);
  }

  @Get('readOne/:id')
  @Public()
  readOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storyFromGardenService.readOne(id);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UploadSingle('file', './uploads/story-from-garden')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStoryFromGardenDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.storyFromGardenService.update(id, dto, file);
  }

  @Delete('delete/:id')
  @Public()
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.storyFromGardenService.delete(id);
  }
}
