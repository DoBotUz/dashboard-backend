import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BotNotification, STATUSES as BOT_NOTIF_STATUSES } from './bot-notification.entity';

@Injectable()
export class BotNotificationsService {
  constructor(
    @InjectRepository(BotNotification)
    private botNotificationsRepository: Repository<BotNotification>,
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
}