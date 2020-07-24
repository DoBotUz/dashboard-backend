import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './item.entity';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
  ) {}
  
  async createNew(data: any): Promise<Item> {
    data.status = this.itemModel.STATUSES.ACTIVE;
    return await this.itemModel.create(data);
  }

  async findOne(id: number): Promise<Item> {
    return this.itemModel.findOne({
      where: {
        id,
      },
      include: [Category]
    });
  }

  async listAll(bot_id: number): Promise<Item[]> {
    return this.itemModel.findAll({
      include: [{
        model: Category,
        required: true,
        where: {
            bot_id,
        },
      }]
    });
  }

  async updateOne(id: number, data: any): Promise<Item> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }

  async activate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Item.STATUSES.ACTIVE;
    await model.save();
  }

  async deactivate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Item.STATUSES.INACTIVE;
    await model.save();
  }

  async delete(id: number): Promise<void> {
    const model = await this.findOne(id);
    await model.destroy();
  }
}
