import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, STATUSES } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}
  
  async createNew(data: any): Promise<Item> {
    data.status = STATUSES.ACTIVE;
    const model = new Item();
    Object.assign(model, data);
    return await this.itemsRepository.save(model);
  }

  async findOne(id: number): Promise<Item> {
    return this.itemsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async listAll(bot_id: number): Promise<Item[]> {
    return this.itemsRepository.find({
      where: {
        bot_id
      }
    });
  }

  async updateOne(id: number, data: any): Promise<Item> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.itemsRepository.save(model);
  }

  async activate(id: number): Promise<Item> {
    const model = await this.findOne(id);
    model.status = STATUSES.ACTIVE;
    return await this.itemsRepository.save(model);
  }

  async deactivate(id: number): Promise<Item> {
    const model = await this.findOne(id);
    model.status = STATUSES.INACTIVE;
    return await this.itemsRepository.save(model);
  }

  async delete(id: number): Promise<boolean> {
    const model = await this.findOne(id);
    await this.itemsRepository.remove(model);
    return true;
  }
}
