import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { Bot } from 'src/bots/bot.entity';
import { BotNotificationBotUser } from './bot-notification-bot-user.entity';

@Injectable()
export class BotNotificationsService {
  constructor(
    @InjectModel(BotNotification)
    private botNotificationModel: typeof BotNotification,
    @InjectModel(BotNotificationTemplate)
    private botNotificationTemplateModel: typeof BotNotificationTemplate,
    @InjectModel(BotNotificationBotUser)
    private botNotificationBotUserModel: typeof BotNotificationBotUser,
  ) {}
  
  async findOne(id: number): Promise<BotNotification> {
    return this.botNotificationModel.findOne({
      where: {
        id,
      },
      include: [Bot, BotNotificationTemplate],
    });
  }

  async findOneTemplate(id: number): Promise<BotNotificationTemplate> {
    return this.botNotificationTemplateModel.findOne({
      where: {
        id,
      },
    });
  }

  async listAllBots(bot_id: number): Promise<BotNotification[]> {
    return this.botNotificationModel.findAll({
      where: {
        bot_id,
      },
      include: [Bot, BotNotificationTemplate],
    })
  }

  async create(data: any): Promise<BotNotification> {
    data.status = this.botNotificationModel.STATUSES.PENDING;
    return await this.botNotificationModel.create(data);
  }

  async update(id: number, data: any): Promise<BotNotification> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }

  async deleteBotUsers(bot_notification_id: number, bot_user_ids: number[]): Promise<void> {
    this.botNotificationBotUserModel.destroy({
      where: {
        bot_notification_id,
        bot_user_id: bot_user_ids,
      },
    })
  }

  async assignNotification(data: any): Promise <BotNotificationBotUser> {
    return await this.botNotificationBotUserModel.create(data);
  }

  async createTemplate(data: any): Promise<BotNotificationTemplate> {
    data.status = this.botNotificationTemplateModel.STATUSES.ACTIVE;
    return await this.botNotificationTemplateModel.create(data);
  }

  async updateTemplate(id: number, data: any): Promise<BotNotificationTemplate> {
    const model = await this.findOneTemplate(id);
    await model.update(data);
    return model;
  }
}