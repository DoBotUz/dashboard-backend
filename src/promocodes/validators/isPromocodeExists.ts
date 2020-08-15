import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PromocodesService } from '../promocodes.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsPromocodeExists', async: true })
@Injectable()
export class IsPromocodeExists implements ValidatorConstraintInterface {
  constructor(private promocodesService: PromocodesService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const promocode = await this.promocodesService.findOne(id);
    return Boolean(promocode);
  }
  defaultMessage(): string {
    return 'Promocode does not exist';
  }
}