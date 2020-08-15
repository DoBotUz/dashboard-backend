import { Test, TestingModule } from '@nestjs/testing';
import { PromocodesService } from './promocodes.service';

describe('PromocodesService', () => {
  let service: PromocodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromocodesService],
    }).compile();

    service = module.get<PromocodesService>(PromocodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
