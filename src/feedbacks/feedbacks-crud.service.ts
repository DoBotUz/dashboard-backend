import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbacksCrudService extends TypeOrmCrudService<Feedback> {
  constructor(
    @InjectRepository(Feedback)
    public repo: Repository<Feedback>,
  ) {
    super(repo)
  }
}
