import { Test, TestingModule } from '@nestjs/testing';
import { StoryFromGardenService } from './story-from-garden.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StoryFromGardenService', () => {
  let service: StoryFromGardenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryFromGardenService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StoryFromGardenService>(StoryFromGardenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
