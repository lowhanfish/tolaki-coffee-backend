import { Module } from '@nestjs/common';
import { PartnershipStandardService } from './partnership-standard.service';
import { PartnershipStandardController } from './partnership-standard.controller';

@Module({
  controllers: [PartnershipStandardController],
  providers: [PartnershipStandardService],
})
export class PartnershipStandardModule {}
