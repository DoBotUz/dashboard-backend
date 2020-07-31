import { Test, TestingModule } from '@nestjs/testing';
import { BotUsersController } from './bot-users.controller';

describe('BotUsers Controller', () => {
  let controller: BotUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotUsersController],
    }).compile();

    controller = module.get<BotUsersController>(BotUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
