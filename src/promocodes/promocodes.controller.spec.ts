import { Test, TestingModule } from '@nestjs/testing';
import { PromocodesController } from './promocodes.controller';

describe('Promocodes Controller', () => {
  let controller: PromocodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromocodesController],
    }).compile();

    controller = module.get<PromocodesController>(PromocodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
