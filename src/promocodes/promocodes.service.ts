import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocode, STATUSES } from './promocode.entity';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectRepository(Promocode)
    private promocodesRepository: Repository<Promocode>,
  ) {}

  async createNew(data: any): Promise<Promocode> {
    data.status = STATUSES.ACTIVE;
    const model = new Promocode();
    Object.assign(model, data);
    return await this.promocodesRepository.save(model);
  }

  async findOne(id: number): Promise<Promocode> {
    return this.promocodesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateOne(id: number, data: any): Promise<Promocode> {
    const model = await this.findOne(id);
    Object.assign(model, data);
    return await this.promocodesRepository.save(model);
  }
}
