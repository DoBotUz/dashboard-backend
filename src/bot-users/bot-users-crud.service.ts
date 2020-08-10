import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { BotUser } from './bot-user.entity';

@Injectable()
export class BotUsersCrudService extends TypeOrmCrudService<BotUser> {
  constructor(
    @InjectRepository(BotUser)
    public repo: Repository<BotUser>,
  ) {
    super(repo)
  }
}
