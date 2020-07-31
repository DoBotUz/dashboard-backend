import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { OrdersService } from '../orders.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isOrderExist', async: true })
@Injectable()
export class IsOrderExists implements ValidatorConstraintInterface {
    constructor(private ordersService: OrdersService) {}
    async validate(id: number): Promise<boolean> {
      if(!id)
        return false;
      const bot = await this.ordersService.findOne(id);
      return Boolean(bot);
    }
    defaultMessage(): string {
        return 'Order does not exist';
    }
}