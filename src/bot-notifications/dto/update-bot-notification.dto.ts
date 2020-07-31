import { IsNotEmpty, Validate } from 'class-validator';
import { BaseBotNotificationDto } from './base-bot-notification.dto';
import { isBotNotificationExists } from '../validators';

export class UpdateBotNotificationDto extends BaseBotNotificationDto {
  @IsNotEmpty()
  @Validate(isBotNotificationExists)
  id: number;
}