import { IsNotEmpty, Validate, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { isBotNotificationTemplateExists } from '../validators';
import { IsBotUserExists } from 'src/bot-users/validators';

export class BaseBotNotificationDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  bot_id: number;

  @IsNotEmpty()
  @Validate(isBotNotificationTemplateExists)
  bot_notification_template_id: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  after_date_time: Date;

  @IsNotEmpty()
  @IsArray()
  @Validate(IsBotUserExists, {each: true})
  bot_user_ids: number[];
}