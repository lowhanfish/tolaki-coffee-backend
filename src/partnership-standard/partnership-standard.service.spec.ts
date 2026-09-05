import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipStandardService } from './partnership-standard.service';

describe('PartnershipStandardService', () => {
  let service: PartnershipStandardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnershipStandardService],
    }).compile();

    service = module.get<PartnershipStandardService>(PartnershipStandardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
