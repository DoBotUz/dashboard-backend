import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot, STATUSES } from './bot.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
  ) {}
  
  async createNew(data: any): Promise<Bot> {
    data.status = STATUSES.ACTIVE;
    const bot = new Bot();
    Object.assign(bot, data);
    return await this.botsRepository.save(bot);
  }

  async findOne(id: number): Promise<Bot> {
    return this.botsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Bot> {
    const model = await this.findOne(id);
    if (model) {
      Object.assign(model, data);
      return await this.botsRepository.save(model);
    }
  }

  async setIsOnline(id: number, flag: boolean): Promise<Bot> {
    const model = await this.findOne(id);
    if (model) {
      Object.assign(model, {
        is_online: flag,
      });
      return await this.botsRepository.save(model);
    }
  }
}
