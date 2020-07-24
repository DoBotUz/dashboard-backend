import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.entity';
import { Bot } from 'src/bots/bot.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}
  
  async createNew(data: any): Promise<Category> {
    data.status = this.categoryModel.STATUSES.ACTIVE;
    return await this.categoryModel.create(data);
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryModel.findOne({
      where: {
        id,
      },
      include: [Bot, Category]
    });
  }

  async listAll(bot_id: number): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: {
        bot_id,
      },
      include: [Bot, Category]
    });
  }

  async updateOne(id: number, data: any): Promise<Category> {
    const model = await this.findOne(id);
    await model.update(data);
    return model;
  }

  async activate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Category.STATUSES.ACTIVE;
    await model.save();
  }

  async deactivate(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.status = Category.STATUSES.INACTIVE;
    await model.save();
  }

  async delete(id: number): Promise<void> {
    const model = await this.findOne(id);
    await model.destroy();
  }
}
