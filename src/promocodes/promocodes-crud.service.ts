import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Promocode } from './promocode.entity';

@Injectable()
export class PromocodeCrudService extends TypeOrmCrudService<Promocode> {
  constructor(
    @InjectRepository(Promocode)
    public organizationsRepository: Repository<Promocode>,
  ) {
    super(organizationsRepository)
  }
}
