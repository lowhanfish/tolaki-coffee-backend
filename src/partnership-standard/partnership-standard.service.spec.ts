import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipStandardService } from './partnership-standard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartnershipStandardService', () => {
  let service: PartnershipStandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnershipStandardService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PartnershipStandardService>(PartnershipStandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
