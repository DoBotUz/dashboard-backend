import { IsNotEmpty, IsOptional, Length, Validate } from 'class-validator';
import { IsBotExists } from 'src/bots/validators';
import { IsCategoryExists } from '../validators';

export class BaseCategoryDTO {
  @IsNotEmpty()
  @Validate(IsBotExists)
  bot_id: number;

  @IsOptional()
  @Validate(IsCategoryExists)
  parent_category_id: number;

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
  pos: number;
}