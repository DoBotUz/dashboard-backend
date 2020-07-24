import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './bot.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectModel(Bot)
    private botModel: typeof Bot,
  ) {}
  
  async createNew(data: any): Promise<Bot> {
    data.status = this.botModel.STATUSES.ACTIVE;
    return await this.botModel.create(data);
  }
}
