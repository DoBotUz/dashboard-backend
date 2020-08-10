import { ValidateNested, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseOrganizationDTO, BaseBotDto } from './base-organization.dto';

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



export class CreateOrganizationBranchBotDTO extends BaseOrganizationDTO {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BaseBotDto)
  bot: BaseBotDto;
}