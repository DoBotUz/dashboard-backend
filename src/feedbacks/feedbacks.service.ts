import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './feedback.entity';
import { BotUser } from 'src/bot-users/bot-user.entity';
import { Bot } from 'src/bots/bot.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback)
    private feedbackModel: typeof Feedback,
  ) {}
  
  listAllBots(bot_id: number): Promise<Feedback[]> {
    return this.feedbackModel.findAll({
      include: [{
        model: BotUser,
        include: [{
          model: Bot,
          required: true,
          where: {
            id: bot_id
          }
        }]
      }]
    })
  }

  async findOne(id: number): Promise<Feedback> {
    return this.feedbackModel.findOne({
      where: {
        id,
      },
    });
  }

}