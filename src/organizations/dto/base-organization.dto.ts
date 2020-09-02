import { IsNotEmpty, Length, Validate, ValidateNested, IsNumber, IsString, IsBoolean, IsInt, IsIn, IsOptional, IsAscii, IsJSON } from 'class-validator';
import { IsUserExists } from 'src/users/validators';
import { STATUSES } from '../organization.entity';
import { Transform } from 'class-transformer';


export class BaseOrganizationDTO {
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  @IsAscii()
  slug: string;

  @IsNotEmpty()
  @IsString()
  ru_description: string;

  @IsNotEmpty()
  @IsString()
  en_description: string;

  @IsNotEmpty()
  @IsString()
  uz_description: string;

  @IsOptional()
  @IsJSON()
  delivery_settings: string;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsInt()
  delivery_time_range_start: number;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsInt()
  delivery_time_range_end: number;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsInt()
  @IsIn(Object.values(STATUSES))
  status: number;

  thumbnail: string;
}