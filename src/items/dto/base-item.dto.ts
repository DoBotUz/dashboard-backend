import { IsNotEmpty, Length, Validate, IsNumber, IsString, IsIn, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { IsCategoryExists } from 'src/categories/validators';
import { STATUSES } from '../item.entity';

export class BaseItemDto {
  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @Validate(IsCategoryExists)
  categoryId: number;

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

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  amount: number;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;

  thumbnail: string;
}