import { IsNotEmpty, Validate } from 'class-validator';
import { BaseCategoryDTO } from './base-category.dto';
import { IsCategoryExists } from '../validators';

export class UpdateCategoryDTO extends BaseCategoryDTO {
  @IsNotEmpty()
  @Validate(IsCategoryExists)
  id: number;
}