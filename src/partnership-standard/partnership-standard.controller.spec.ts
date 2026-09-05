import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipStandardController } from './partnership-standard.controller';
import { PartnershipStandardService } from './partnership-standard.service';

describe('PartnershipStandardController', () => {
  let controller: PartnershipStandardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnershipStandardController],
      providers: [PartnershipStandardService],
    }).compile();

    controller = module.get<PartnershipStandardController>(PartnershipStandardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
