import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Item } from './item.entity';

@Injectable()
export class ItemsCrudService extends TypeOrmCrudService<Item> {
  constructor(
    @InjectRepository(Item)
    public repo: Repository<Item>,
  ) {
    super(repo)
  }
}
