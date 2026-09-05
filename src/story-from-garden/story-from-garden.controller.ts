import { Controller } from '@nestjs/common';
import { StoryFromGardenService } from './story-from-garden.service';

@Controller('story-from-garden')
export class StoryFromGardenController {
  constructor(private readonly storyFromGardenService: StoryFromGardenService) {}
}
