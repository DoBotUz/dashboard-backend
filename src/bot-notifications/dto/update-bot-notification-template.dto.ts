import { IsNotEmpty, Validate } from 'class-validator';
import { BaseBotNotificationTemplateDto } from './base-bot-notification-template.dto';
import { isBotNotificationTemplateExists } from '../validators';

export class UpdateBotNotificationTemplateDto extends BaseBotNotificationTemplateDto {
  @IsNotEmpty()
  @Validate(isBotNotificationTemplateExists)
  id: number;
}