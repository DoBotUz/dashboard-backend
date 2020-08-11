import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { isFeedbackExists } from '../validators';
import { CreateBotNotificationTemplateDto } from 'src/bot-notifications/dto';
import { IsBotUserExists } from 'src/bot-users/validators/isBotUserExists';

export class AnswerFeedbackDto {
  @IsNotEmpty()
  @Validate(isFeedbackExists)
  id: number;

  @IsNotEmpty()
  @Validate(IsBotUserExists)
  bot_user_id: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBotNotificationTemplateDto)
  template: CreateBotNotificationTemplateDto;
}