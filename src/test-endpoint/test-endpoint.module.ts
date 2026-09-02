import { Module } from '@nestjs/common';
import { TestEndpointService } from './test-endpoint.service';
import { TestEndpointController } from './test-endpoint.controller';

@Module({
  controllers: [TestEndpointController],
  providers: [TestEndpointService],
})
export class TestEndpointModule {}
