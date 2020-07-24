import { IsOptional, Length } from 'class-validator';
import { BaseUserDTO } from './base-user.dto';

export class UpdateUserDTO extends BaseUserDTO {
  @IsOptional()
  @Length(6, 255)
  password: string;
}