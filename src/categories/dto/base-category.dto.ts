import { IsNotEmpty, IsOptional, Length, Validate, IsString, IsNumber, IsIn } from 'class-validator';
import { IsCategoryExists } from '../validators';
import { STATUSES } from '../category.entity';
import { Transform } from 'class-transformer';

export class BaseCategoryDto {
  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @Validate(IsCategoryExists)
  parentCategoryId: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  ru_title: string;

  @IsNotEmpty()
  @IsString()
  ru_description: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  en_title: string;

  @IsNotEmpty()
  @IsString()
  en_description: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  uz_title: string;

  @IsNotEmpty()
  @IsString()
  uz_description: string;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  pos: number;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;

  thumbnail: string;
}