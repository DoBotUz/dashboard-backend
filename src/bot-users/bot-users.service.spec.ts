import { Test, TestingModule } from '@nestjs/testing';
import { BotUsersService } from './bot-users.service';

describe('BotUsersService', () => {
  let service: BotUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotUsersService],
    }).compile();

    service = module.get<BotUsersService>(BotUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
