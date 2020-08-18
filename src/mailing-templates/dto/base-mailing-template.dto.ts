import { IsNotEmpty, Length, Validate, IsAscii, IsIn, IsNumber, IsOptional, IsDate } from 'class-validator';
import { IsBotExists } from 'src/bots/validators';
import { Transform, Type } from 'class-transformer';
import { CATS_ENUM, STATUSES } from '../mailing-template.entity';
import { IsOrganizationExists } from 'src/organizations/validators';

export class BaseMailingTemplateDto {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  organizationId: number;

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

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  after_date_time: Date;

  @IsNotEmpty()
  @Transform((value) => {
    return String(value)
  })
  @IsAscii()
  @IsIn(Object.values(CATS_ENUM))
  category: string;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;

  thumbnail: string;
  type: number;
}