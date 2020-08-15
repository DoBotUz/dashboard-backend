import { IsNotEmpty, Validate, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

import { AreValidKeys } from '../validators/AreValidKeys';
import { KEYS } from 'src/notifications/notification.entity';
import { IsBotExists } from 'src/bots/validators';

export class WsNotificationDto{
  @IsNotEmpty()
  @Transform((value) => Number(value))
  key_id: number;

  @IsNotEmpty()
  @Transform((value) => Number(value))
  @IsIn(Object.keys(KEYS))
  key: number;
}
export class NewNotificationDto {
  @IsNotEmpty()
  @Transform((value) => Number(value))
  @Validate(IsBotExists)
  bot_id: number;

  @IsNotEmpty()
  @Validate(AreValidKeys)
  notification: WsNotificationDto;
}