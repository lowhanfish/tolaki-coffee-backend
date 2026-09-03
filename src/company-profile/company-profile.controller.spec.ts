import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';

describe('CompanyProfileController', () => {
  let controller: CompanyProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyProfileController],
      providers: [CompanyProfileService],
    }).compile();

    controller = module.get<CompanyProfileController>(CompanyProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
