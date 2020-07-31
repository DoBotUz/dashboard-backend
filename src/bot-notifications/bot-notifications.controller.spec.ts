import { Test, TestingModule } from '@nestjs/testing';
import { BotNotificationsController } from './bot-notifications.controller';

describe('BotNotifications Controller', () => {
  let controller: BotNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotNotificationsController],
    }).compile();

    controller = module.get<BotNotificationsController>(BotNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
