import { IsNotEmpty, Length, Validate, ValidateNested, IsNumber, IsString, IsBoolean, IsInt, IsIn, IsOptional } from 'class-validator';
import { IsUserExists } from 'src/users/validators';
import { IsLoggedInUser } from 'src/users/validators/IsLoggedInUser';
import { STATUSES } from '../organization.entity';


export class BaseOrganizationDTO {
  @IsNotEmpty()
  @Validate(IsLoggedInUser)
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
  @IsNumber()
  fixed_delivery_price: number;

  @IsNotEmpty()
  @IsBoolean()
  is_multilanguage: boolean;

  @IsNotEmpty()
  @IsNumber()
  min_order_charge: number;

  @IsNotEmpty()
  @IsNumber()
  free_distance: number;

  @IsOptional()
  @IsNumber()
  per_km_deliver_price: number;

  @IsOptional()
  @IsInt()
  delivery_time_range_start: number;

  @IsOptional()
  @IsInt()
  delivery_time_range_end: number;

  @IsOptional()
  @IsInt()
  @IsIn(Object.values(STATUSES))
  status: number;

  thumbnail: string;
}