import { IsNotEmpty, Length, Validate, ValidateNested, IsNumber, IsString, IsBoolean, IsInt, IsIn, IsOptional } from 'class-validator';
import { IsUserExists } from 'src/users/validators';
import { STATUSES } from '../organization.entity';
import { Transform } from 'class-transformer';


export class BaseOrganizationDTO {
  userId: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  ru_title: string;

  @IsNotEmpty()
  @IsString()
  ru_description: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  en_title: string;

  @IsNotEmpty()
  @IsString()
  en_description: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  uz_title: string;

  @IsNotEmpty()
  @IsString()
  uz_description: string;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  fixed_delivery_price: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Boolean(value)
  })
  @IsBoolean()
  is_multilanguage: boolean;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  min_order_charge: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  free_distance: number;

  @IsOptional()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  per_km_deliver_price: number;

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