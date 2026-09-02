import { Test, TestingModule } from '@nestjs/testing';
import { TestEndpointService } from './test-endpoint.service';

describe('TestEndpointService', () => {
  let service: TestEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestEndpointService],
    }).compile();

    service = module.get<TestEndpointService>(TestEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
