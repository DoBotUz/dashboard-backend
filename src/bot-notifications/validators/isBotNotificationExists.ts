import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BotNotificationsService } from '../bot-notifications.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBotNotificationExists', async: true })
@Injectable()
export class isBotNotificationExists implements ValidatorConstraintInterface {
  constructor(private modelService: BotNotificationsService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const model = await this.modelService.findOne(id);
    return Boolean(model);
  }
  defaultMessage(): string {
    return 'BotNotification does not exist';
  }
}