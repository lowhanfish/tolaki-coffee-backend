import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipStandardController } from './partnership-standard.controller';
import { PartnershipStandardService } from './partnership-standard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartnershipStandardController', () => {
  let controller: PartnershipStandardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnershipStandardController],
      providers: [
        PartnershipStandardService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PartnershipStandardController>(PartnershipStandardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
