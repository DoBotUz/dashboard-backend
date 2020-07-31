import { IsNotEmpty, Length, Validate } from 'class-validator';
import { IsBotExists } from 'src/bots/validators';

export class BaseBotNotificationTemplateDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  bot_id: number;

  @IsNotEmpty()
  @Length(3, 255)
  ru_title: string;

  @IsNotEmpty()
  ru_description: string;

  @IsNotEmpty()
  @Length(3, 255)
  en_title: string;

  @IsNotEmpty()
  en_description: string;

  @IsNotEmpty()
  @Length(3, 255)
  uz_title: string;

  @IsNotEmpty()
  uz_description: string;

  thumbnail: string;
  type: number;
}