import { ValidateNested, IsNotEmpty, IsOptional, Length, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseOrganizationDTO } from './base-organization.dto';
import { UniqueBotToken } from 'src/bots/validators';

class Branch {
  @IsNotEmpty()
  @Length(3, 255)
  title: string;

  @IsNotEmpty()
  lat: number;

  @IsOptional()
  lng: number;

  @IsNotEmpty()
  is_all_day: number;
}

export class BaseBotDto {
  @IsNotEmpty()
  @Validate(UniqueBotToken)
  @Length(3, 512)
  token: string;
}



export class CreateOrganizationBranchBotDTO extends BaseOrganizationDTO {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BaseBotDto)
  bot: BaseBotDto;
}