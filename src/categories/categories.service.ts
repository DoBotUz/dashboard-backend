import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, STATUSES } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  
  async createNew(data: any): Promise<Category> {
    data.status = STATUSES.ACTIVE;
    const model = new Category();
    Object.assign(model, data);
    return await this.categoriesRepository.save(model);
  }

  async findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async listAll(bot_id: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        bot_id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Category> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.categoriesRepository.save(model);
  }

  async activate(id: number): Promise<Category> {
    const model = await this.findOne(id);
    model.status = STATUSES.ACTIVE;
    return await this.categoriesRepository.save(model);
  }

  async deactivate(id: number): Promise<Category> {
    const model = await this.findOne(id);
    model.status = STATUSES.INACTIVE;
    return await this.categoriesRepository.save(model);
  }

  async delete(id: number): Promise<boolean> {
    const model = await this.findOne(id);
    await this.categoriesRepository.remove(model);
    return true;
  }
}
