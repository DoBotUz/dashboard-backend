import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, STATUSES, KEYS, TYPES } from './notification.entity';
import { OrdersService } from 'src/orders/orders.service';
import { BotUsersService } from 'src/bot-users/bot-users.service';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { BotsService } from 'src/bots/bots.service';
import { FrontendGateway } from 'src/gateways/frontend/frontend.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,

    private botsService: BotsService,
    private ordersService: OrdersService,
    private botUsersService: BotUsersService,
    private feedbacksService: FeedbacksService,
    private frontendGateway: FrontendGateway,
    private usersService: UsersService,
  ) {}
  
  async findOne(id: number): Promise<Notification> {
    return this.notificationsRepository.findOne(id);
  }

  async readAll(userId: number): Promise<boolean> {
    this.notificationsRepository.createQueryBuilder()
    .update()
    .set({ status: STATUSES.READ })
    .where(`userId = :userId`, { userId})
    .execute();
    return true;
  }

  async readOne(id: number): Promise<boolean> {
    const model = await this.findOne(id);
    model.status = STATUSES.READ;
    this.notificationsRepository.save(model);
    return true;
  }

  async findOneRecordByKeyAndId(key: number, key_id: number): Promise<any> {
    switch(key) {
      case KEYS.NEW_ORDER:
        return this.ordersService.findOne(key_id);
        break;
      case KEYS.NEW_BOT_USER:
        return this.botUsersService.findOne(key_id);
        break;
      
      case KEYS.NEW_FEEDBACK:
        return this.feedbacksService.findOne(key_id);
        break;

      case KEYS.NEW_MESSAGE:
        return false;
        break;
      default:
        return false;
    }
  }

  async notify(org_id: number, key: number, key_id: number): Promise<any> {
    const usersAndEmployees = await this.usersService.findUsersOfOrganization(org_id);

    const notification = {
      status: STATUSES.PENDING,
      type: TYPES.INFO,
      key: key,
      key_id: key_id,
    }
    await this.notificationsRepository.insert(usersAndEmployees.map(uae => ({
      ...notification,
      userId: uae.id
    })));

    this.frontendGateway.notifyUsers(org_id, notification);
    return true;
  }
  
}
