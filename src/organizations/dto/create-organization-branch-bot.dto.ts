import { ValidateNested, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseOrganizationDTO } from './base-organization.dto';

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

class Bot {
  @IsNotEmpty()
  @Length(3, 512)
  token: string;
}


export class CreateOrganizationBranchBotDTO extends BaseOrganizationDTO {
  @IsOptional()
  user_id: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Branch)
  branch: Branch;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Bot)
  bot: Bot;
}