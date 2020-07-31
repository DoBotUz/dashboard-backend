import { Test, TestingModule } from '@nestjs/testing';
import { BotsGateway } from './bots.gateway';

describe('BotsGateway', () => {
  let gateway: BotsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotsGateway],
    }).compile();

    gateway = module.get<BotsGateway>(BotsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
