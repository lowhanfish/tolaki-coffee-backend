import { Module } from '@nestjs/common';
import { StoryFromGardenService } from './story-from-garden.service';
import { StoryFromGardenController } from './story-from-garden.controller';

@Module({
  controllers: [StoryFromGardenController],
  providers: [StoryFromGardenService],
})
export class StoryFromGardenModule {}
