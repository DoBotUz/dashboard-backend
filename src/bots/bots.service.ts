import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot, STATUSES } from './bot.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bot)
    private botsRepository: Repository<Bot>,
  ) { }

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

  async findOneByOrgId(organizationId: number): Promise<Bot> {
    return this.botsRepository.findOne({
      where: {
        organizationId,
      },
    });
  }

  async findOneByToken(token: string): Promise<Bot> {
    return this.botsRepository.findOne({
      where: {
        token,
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

  async updateOneModel(model: Bot): Promise<Bot> {
    return await this.botsRepository.save(model);
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

  async findBotOwner(id: number): Promise<User> {
    const model = await this.botsRepository.createQueryBuilder('bot').where("bot.id = :id", { id }).innerJoinAndSelect("bot.organization", "organization").innerJoinAndSelect("organization.user", "user")
      .getOne();

    if (!model) {
      throw new BadRequestException('Forbidden');
    }

    return model.organization.user;
  }

  public async isTokenUnique(token: string, bot_id?: number): Promise<boolean> {
    const bot = await this.findOneByToken(token);
    let botById = null;
    if (bot_id) {
      botById = await this.findOne(bot_id);
    }
    if(!bot)
      return true;
    else {
      if(botById && bot.token == botById.token)
        return true;
      else
        return false;
    }
  }
}
