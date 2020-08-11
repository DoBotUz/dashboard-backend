import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { isFeedbackExists } from '../validators';
import { CreateBotNotificationTemplateDto } from 'src/bot-notifications/dto';

export class AnswerFeedbackDto {
  @IsNotEmpty()
  @Validate(isFeedbackExists)
  id: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateBotNotificationTemplateDto)
  template: CreateBotNotificationTemplateDto;
}