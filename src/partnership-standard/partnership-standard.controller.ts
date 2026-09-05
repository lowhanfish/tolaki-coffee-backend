import { Controller } from '@nestjs/common';
import { PartnershipStandardService } from './partnership-standard.service';

@Controller('partnership-standard')
export class PartnershipStandardController {
  constructor(private readonly partnershipStandardService: PartnershipStandardService) {}
}
