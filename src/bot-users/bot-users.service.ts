import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotUser } from './bot-user.entity';

@Injectable()
export class BotUsersService {
  constructor(
    @InjectRepository(BotUser)
    private botUsersRepository: Repository<BotUser>,
  ) {}
  
  async listAllByBotId(bot_id: number): Promise<BotUser[]> {
    return this.botUsersRepository.find({
      where: {
        bot_id
      },
    })
  }

  async findOne(id: number): Promise<BotUser> {
    return this.botUsersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneWithBot(id: number): Promise<BotUser> {
    return this.botUsersRepository.findOne({
      where: {
        id,
      },
      join: {
        alias: 'botUser',
        leftJoinAndSelect: {
          bot: 'botUser.bot',
        }
      }
    });
  }
}
