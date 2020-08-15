import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { WsNotificationDto } from '../dto/new-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@ValidatorConstraint({ name: 'AreValidKeys', async: true })
@Injectable()
export class AreValidKeys implements ValidatorConstraintInterface {
  constructor(private modelService: NotificationsService) {}

  async validate(newNotif: WsNotificationDto): Promise<boolean> {
    if (!newNotif) {
      return false;
    }
    const model = await this.modelService.findOneRecordByKeyAndId(newNotif.key, newNotif.key_id);

    if (!model) {
      return false;
    }
    return true;
  }
  defaultMessage(): string {
    return 'Key Record does not exist';
  }
}