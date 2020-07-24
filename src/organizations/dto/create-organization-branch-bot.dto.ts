import { ValidateNested, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';


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


export class CreateOrganizationBranchBot {
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

  @IsNotEmpty()
  fixed_delivery_price: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Branch)
  branch: Branch;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Bot)
  bot: Bot;
}