import { IsNotEmpty, Validate, IsNumber, IsIn } from 'class-validator';
import { IsOrderExists } from '../validators';
import { Order } from '../order.entity';

export class UpdateOrderDTO {
  @IsNotEmpty()
  @Validate(IsOrderExists)
  id: number;

  @IsNumber()
  @IsIn(Object.values(Order.STATUSES))
  status: number;
}