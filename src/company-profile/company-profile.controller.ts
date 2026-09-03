import { Controller } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';

@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}
}
