import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Order } from './order.entity';

@Injectable()
export class OrdersCrudService extends TypeOrmCrudService<Order> {
  constructor(
    @InjectRepository(Order)
    public repo: Repository<Order>,
  ) {
    super(repo)
  }
}
