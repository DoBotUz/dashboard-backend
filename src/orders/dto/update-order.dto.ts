import { IsNotEmpty, Validate, IsNumber, IsIn, IsOptional, IsString, Length, IsArray, ValidateNested, IsInt } from 'class-validator';
import { PAYMENT_TYPES, STATUSES } from '../order.entity';
import { IsBranchExists } from 'src/branches/validators';
import { Type, Transform, plainToClass } from 'class-transformer';
import { IsItemExists } from 'src/items/validators';
import { IsOrderExists } from '../validators/isOrderExists';

export class OrderItemDto {
  @IsNotEmpty()
  @Validate(IsOrderExists)
  order_id: number;

  @IsNotEmpty()
  @Validate(IsItemExists)
  item_id: number;

  @IsNotEmpty()
  @IsInt()
  amount: number;
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @Validate(IsOrderExists)
  id?: number;

  @IsNotEmpty()
  @Validate(IsBranchExists)
  branch_id: number;

  @IsNotEmpty()
  @IsNumber()
  total_charge: number;

  @IsNotEmpty()
  @IsNumber()
  delivery_charge: number;

  @IsOptional()
  for_datetime: string;

  @IsOptional()
  @IsNumber()
  lat: number;

  @IsOptional()
  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  @Length(1,255)
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(Object.values(PAYMENT_TYPES))
  payment_type: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  phone: string;

  @IsOptional()
  @IsString()
  @Length(1, 512)
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  order_items: OrderItemDto[]
}