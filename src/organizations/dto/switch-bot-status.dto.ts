import { IsNotEmpty, Validate, IsIn, IsInt } from 'class-validator';
import { IsOrganizationExists } from '../validators';
import { Transform } from 'class-transformer';
import { STATUSES } from 'src/bots/bot.entity';

export class SwitchBotStatusDto{
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  id: number;
  
  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsInt()
  @IsIn(Object.values(STATUSES))
  status: number;
}