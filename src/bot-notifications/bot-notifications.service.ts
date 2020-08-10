import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotNotification, STATUSES as BOT_NOTIF_STATUSES } from './bot-notification.entity';
import { BotNotificationTemplate, STATUSES as TEMPLATE_STATUSES, TYPES } from './bot-notification-template.entity';

@Injectable()
export class BotNotificationsService {
  constructor(
    @InjectRepository(BotNotification)
    private botNotificationsRepository: Repository<BotNotification>,
    @InjectRepository(BotNotificationTemplate)
    private botNotificationTemplatesRepository: Repository<BotNotificationTemplate>,
  ) {}
  
  async findOne(id: number): Promise<BotNotification> {
    return this.botNotificationsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneTemplate(id: number): Promise<BotNotificationTemplate> {
    return this.botNotificationTemplatesRepository.findOne({
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


  async createTemplate(data: any): Promise<BotNotificationTemplate> {
    data.status = TEMPLATE_STATUSES.ACTIVE;
    data.type = TYPES.MASS_SEND;
    const model = new BotNotificationTemplate();
    Object.assign(model, data);
    return await this.botNotificationTemplatesRepository.save(model);
  }

  async updateTemplate(id: number, data: any): Promise<BotNotificationTemplate> {
    const model = await this.findOneTemplate(id);
    data.type = TYPES.MASS_SEND;
    Object.assign(model, data);
    return await this.botNotificationTemplatesRepository.save(model);
  }
}