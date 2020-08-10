import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { BotNotification } from './bot-notification.entity';

@Injectable()
export class BotNotificationsCrudService extends TypeOrmCrudService<BotNotification> {
  constructor(
    @InjectRepository(BotNotification)
    public repo: Repository<BotNotification>,
  ) {
    super(repo)
  }
}
