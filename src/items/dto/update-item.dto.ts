import { IsNotEmpty, Validate, IsNumber, IsIn } from 'class-validator';
import { BaseItemDto } from './base-item.dto';
import { IsItemExists } from '../validators';
import { STATUSES } from '../item.entity';
import { Transform } from 'class-transformer';

export class UpdateItemDto extends BaseItemDto {
  @IsNotEmpty()
  @Validate(IsItemExists)
  id: number;
}

export class UpdateItemStatusDto {
  @IsNotEmpty()
  @Validate(IsItemExists)
  id: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}