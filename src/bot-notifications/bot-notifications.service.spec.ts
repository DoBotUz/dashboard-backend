import { Test, TestingModule } from '@nestjs/testing';
import { BotNotificationsService } from './bot-notifications.service';

describe('BotNotificationsService', () => {
  let service: BotNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotNotificationsService],
    }).compile();

    service = module.get<BotNotificationsService>(BotNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
