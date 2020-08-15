import { IsNotEmpty, Length, Validate, IsString, IsInt, IsIn, IsOptional, Min } from 'class-validator';
import { STATUSES } from '../promocode.entity';
import { Transform } from 'class-transformer';
import { IsOrganizationExists } from 'src/organizations/validators';


export class BasePromocodeDto {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  organizationId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  left: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  slug: string;

  @IsNotEmpty()
  @Transform((value) => {
    return new Date(value)
  })
  start_datetime: Date;

  @IsOptional()
  @Transform((value) => {
    return new Date(value)
  })
  end_datetime: Date;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsInt()
  @IsIn(Object.values(STATUSES))
  status: number;
}