import { Validate, IsNotEmpty, IsEmail, Length, IsOptional } from 'class-validator';
import { UniqueEmail } from '../validators';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto{
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 255)
  @Validate(UniqueEmail)
  email: string;

  @IsOptional()
  status: number;
}