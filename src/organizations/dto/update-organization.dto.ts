import { IsNotEmpty, Validate, Length, ValidateNested, IsOptional, IsIn, IsNumber, IsString, IsAscii } from 'class-validator';
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
  
  @IsOptional()
  @Transform((value) => {
    return plainToClass(Bot, JSON.parse(value));
  })
  @ValidateNested()
  bot: Bot;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  title: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  @IsAscii()
  slug: string;

  @IsOptional()
  @IsString()
  ru_description: string;

  @IsOptional()
  @IsString()
  en_description: string;

  @IsOptional()
  @IsString()
  uz_description: string;
}