import { IsNotEmpty, Validate } from 'class-validator';
import { BaseItemDTO } from './base-item.dto';
import { IsItemExists } from '../validators';

export class UpdateItemDTO extends BaseItemDTO {
  @IsNotEmpty()
  @Validate(IsItemExists)
  id: number;
}