import { IsNotEmpty, Validate } from 'class-validator';
import { BaseItemDto } from './base-item.dto';
import { IsItemExists } from '../validators';

export class UpdateItemDto extends BaseItemDto {
  @IsNotEmpty()
  @Validate(IsItemExists)
  id: number;
}