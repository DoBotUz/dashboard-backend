import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CategoriesService } from '../categories.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsCategoryExists', async: true })
@Injectable()
export class IsCategoryExists implements ValidatorConstraintInterface {
  constructor(private categoriesService: CategoriesService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const category = await this.categoriesService.findOne(id);
    return Boolean(category);
  }
  defaultMessage(): string {
    return 'Category does not exist';
  }
}