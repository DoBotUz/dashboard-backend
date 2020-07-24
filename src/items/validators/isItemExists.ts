import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ItemsService } from '../items.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsItemExists', async: true })
@Injectable()
export class IsItemExists implements ValidatorConstraintInterface {
  constructor(private itemsService: ItemsService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const category = await this.itemsService.findOne(id);
    return Boolean(category);
  }
  defaultMessage(): string {
    return 'Item does not exist';
  }
}