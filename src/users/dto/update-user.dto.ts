import { IsNotEmpty, Validate, IsNumber, IsIn, IsOptional, Length, IsString } from 'class-validator';
import { IsUserExists } from '../validators';
import { STATUSES } from '../user.entity';
import { Transform } from 'class-transformer';
import { BaseUserDTO } from './base-user.dto';
import { AppRoles } from 'src/app.roles';

export class UpdateUserDto extends BaseUserDTO {
  @IsNotEmpty()
  @Validate(IsUserExists)
  id: number;

  @IsOptional()
  @Length(6, 255)
  password: string;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(AppRoles))
  role: string;
}

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @Validate(IsUserExists)
  id: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}