import { Controller } from '@nestjs/common';
import { TestEndpointService } from './test-endpoint.service';

@Controller('test-endpoint')
export class TestEndpointController {
  constructor(private readonly testEndpointService: TestEndpointService) {}
}
