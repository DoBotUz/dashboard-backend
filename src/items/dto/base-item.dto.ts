import { IsNotEmpty, Length, Validate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCategoryExists } from 'src/categories/validators';

export class BaseItemDTO {
  @IsNotEmpty()
  @Validate(IsCategoryExists)
  category_id: number;

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
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  amount: number;

  thumbnail: string;
}