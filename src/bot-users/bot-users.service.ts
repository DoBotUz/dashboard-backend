import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BotUser } from './bot-user.entity';
import { Bot } from 'src/bots/bot.entity';

@Injectable()
export class BotUsersService {
  constructor(
    @InjectModel(BotUser)
    private botUserModel: typeof BotUser,
  ) {}
  
  async listAll(bot_id: number): Promise<BotUser[]> {
    return this.botUserModel.findAll({
      where: {
        bot_id
      },
      include: [Bot]
    })
  }

  async findOne(id: number): Promise<BotUser> {
    return this.botUserModel.findOne({
      where: {
        id,
      },
      include: [Bot]
    });
  }

  async updateOne(id: number, data: any): Promise<BotUser> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }
}
