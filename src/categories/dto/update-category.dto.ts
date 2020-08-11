import { IsNotEmpty, Validate } from 'class-validator';
import { BaseCategoryDto } from './base-category.dto';
import { IsCategoryExists } from '../validators';

export class UpdateCategoryDto extends BaseCategoryDto {
  @IsNotEmpty()
  @Validate(IsCategoryExists)
  id: number;
}