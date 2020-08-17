import { IsNotEmpty, Validate, IsNumber, IsIn } from 'class-validator';
import { BaseCategoryDto } from './base-category.dto';
import { IsCategoryExists } from '../validators';
import { STATUSES } from '../category.entity';
import { Transform } from 'class-transformer';

export class UpdateCategoryDto extends BaseCategoryDto {
  @IsNotEmpty()
  @Validate(IsCategoryExists)
  id: number;
}

export class UpdateCategoryStatusDto {
  @IsNotEmpty()
  @Validate(IsCategoryExists)
  id: number;

  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}