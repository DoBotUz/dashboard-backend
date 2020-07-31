import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksController } from './feedbacks.controller';

describe('Feedbacks Controller', () => {
  let controller: FeedbacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbacksController],
    }).compile();

    controller = module.get<FeedbacksController>(FeedbacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
