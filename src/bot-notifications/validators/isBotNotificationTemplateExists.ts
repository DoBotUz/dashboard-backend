import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BotNotificationsService } from '../bot-notifications.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isBotNotificationTemplateExists', async: true })
@Injectable()
export class isBotNotificationTemplateExists implements ValidatorConstraintInterface {
  constructor(private modelService: BotNotificationsService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const model = await this.modelService.findOneTemplate(id);
    return Boolean(model);
  }
  defaultMessage(): string {
    return 'BotNotificationTemplate does not exist';
  }
}