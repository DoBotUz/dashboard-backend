import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, STATUSES } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async readAll(userId: number): Promise<boolean> {
    this.notificationsRepository.createQueryBuilder()
    .update()
    .set({ status: STATUSES.READ })
    .where(`userId = :userId`, { userId})
    .execute();
    return true;
  }
}
