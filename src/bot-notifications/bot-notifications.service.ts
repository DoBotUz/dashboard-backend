import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BotNotification, STATUSES as BOT_NOTIF_STATUSES } from './bot-notification.entity';
import { BotNotificationBotUser, STATUSES as BOT_NOTIFICATION_BOT_USER_STATUSES } from './bot-notification-bot-user.entity'; 

@Injectable()
export class BotNotificationsService {
  constructor(
    @InjectRepository(BotNotification)
    private botNotificationsRepository: Repository<BotNotification>,
    @InjectRepository(BotNotificationBotUser)
    private botNotificationBotUserRepository: Repository<BotNotificationBotUser>,
  ) {}
  
  async findOne(id: number): Promise<BotNotification> {
    return this.botNotificationsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async listAllBots(bot_id: number): Promise<BotNotification[]> {
    return this.botNotificationsRepository.find({
      where: {
        bot_id,
      },
    })
  }

  async create(data: any): Promise<BotNotification> {
    data.status = BOT_NOTIF_STATUSES.PENDING;
    const botNotif = new BotNotification();
    Object.assign(botNotif, data);
    return await this.botNotificationsRepository.save(botNotif);
  }

  async update(id: number, data: any): Promise<BotNotification> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.botNotificationsRepository.save(model);
  }

  async deleteBotUsers(botNotificationId: number, bot_user_ids: number[]): Promise<void> {
    this.botNotificationBotUserRepository.delete({
      botNotificationId,
      botUserId: In(bot_user_ids),
    })
  }

  async assignNotification(data: any): Promise <BotNotificationBotUser> {
    const model = new BotNotificationBotUser();
    Object.assign(model, data);
    return await this.botNotificationBotUserRepository.save(model);
  }

  async setNotificationBotUsers(botNotificationId: number, bot_user_ids: number[]): Promise<void> {
    await this.deleteBotUsers(botNotificationId, bot_user_ids);
    for (let i = 0; i < bot_user_ids.length; i += 1) {
     await this.assignNotification({
        botNotificationId,
        botUserId: bot_user_ids[i],
        status: BOT_NOTIFICATION_BOT_USER_STATUSES.PENDING
      });
    }
  }
}