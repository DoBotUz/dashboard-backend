import { IsNotEmpty, Validate, IsDate, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { IsBotUserExists } from 'src/bot-users/validators/isBotUserExists';
import { isMailingTemplateExists } from 'src/mailing-templates/validators';

export class BaseBotNotificationDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  bot_id: number;

  @IsNotEmpty()
  @Validate(isMailingTemplateExists)
  mailing_template_id: number;

  @IsNotEmpty()
  @IsArray()
  @Validate(IsBotUserExists, {each: true})
  bot_user_ids: number[];
}