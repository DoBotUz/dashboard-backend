import { IsNotEmpty, Validate, ValidateNested, IsOptional } from 'class-validator';
import { Type, Transform, plainToClass } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { Default } from 'src/common/validators/Default';
import { BaseBotNotificationTemplateDto } from './base-bot-notification-template.dto';

export class CreateMassSendDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  bot_id: number;

  @IsOptional()
  @Default(0)
  after_date_time: number;

  @IsNotEmpty()
  @Transform((value) => {
    return plainToClass(BaseBotNotificationTemplateDto, JSON.parse(value));
  })
  @ValidateNested()
  template: BaseBotNotificationTemplateDto;
}