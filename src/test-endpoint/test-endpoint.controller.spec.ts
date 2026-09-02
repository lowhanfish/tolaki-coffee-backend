import { Test, TestingModule } from '@nestjs/testing';
import { TestEndpointController } from './test-endpoint.controller';
import { TestEndpointService } from './test-endpoint.service';

describe('TestEndpointController', () => {
  let controller: TestEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestEndpointController],
      providers: [TestEndpointService],
    }).compile();

    controller = module.get<TestEndpointController>(TestEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
