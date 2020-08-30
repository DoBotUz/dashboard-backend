import { IsNotEmpty, Validate, IsNumber, IsIn, IsEmail, Length, IsString } from 'class-validator';
import { UniqueEmail } from '../validators';
import { STATUSES } from '../user.entity';
import { Transform } from 'class-transformer';
import { BaseUserDTO } from './base-user.dto';
import { roles } from 'src/app.roles';
import { IsOrganizationExists } from 'src/organizations/validators';

export class CreateUserDto extends BaseUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmail)
  @Length(3, 255)
  email: string;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @Validate(IsOrganizationExists)
  organizationId: number;

  @IsNotEmpty()
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
  @IsIn(Object.values(roles))
  role: string;
}