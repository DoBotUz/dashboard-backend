import { IsNotEmpty, Validate, Length, ValidateNested, IsOptional, IsIn, IsNumber } from 'class-validator';
import { BaseOrganizationDTO } from './base-organization.dto';
import { IsOrganizationExists } from '../validators';
import { Transform, plainToClass } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { STATUSES } from '../organization.entity';

class Bot{
  @IsNotEmpty()
  @Validate(IsBotExists)
  id: number;

  @IsNotEmpty()
  @Length(3, 512)
  token: string;
}

export class UpdateOrganizationDTO extends BaseOrganizationDTO {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  id: number;
  
  @IsNotEmpty()
  @Transform((value) => {
    return plainToClass(Bot, JSON.parse(value));
  })
  @ValidateNested()
  bot: Bot;

}