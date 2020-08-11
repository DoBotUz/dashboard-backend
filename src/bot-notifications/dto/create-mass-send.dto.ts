import { IsNotEmpty, Validate, ValidateNested, IsOptional } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { BaseBotNotificationTemplateDto } from './base-bot-notification-template.dto';

export class CreateMassSendDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  botId: number;

  @IsOptional()
  @Transform((value) => {
    return new Date(value)
  })
  after_date_time: Date;

  @IsNotEmpty()
  @Transform((value) => {
    return plainToClass(BaseBotNotificationTemplateDto, JSON.parse(value));
  })
  @ValidateNested()
  template: BaseBotNotificationTemplateDto;
}