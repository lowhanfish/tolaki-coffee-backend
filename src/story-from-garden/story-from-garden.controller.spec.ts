import { Test, TestingModule } from '@nestjs/testing';
import { StoryFromGardenController } from './story-from-garden.controller';
import { StoryFromGardenService } from './story-from-garden.service';

describe('StoryFromGardenController', () => {
  let controller: StoryFromGardenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryFromGardenController],
      providers: [StoryFromGardenService],
    }).compile();

    controller = module.get<StoryFromGardenController>(StoryFromGardenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
