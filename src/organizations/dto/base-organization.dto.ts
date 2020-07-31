import { IsNotEmpty, Length, Validate } from 'class-validator';
import { IsUserExists } from 'src/users/validators';

export class BaseOrganizationDTO {
  @IsNotEmpty()
  @Validate(IsUserExists)
  user_id: number;

  @IsNotEmpty()
  @Length(3, 255)
  ru_title: string;

  @IsNotEmpty()
  ru_description: string;

  @IsNotEmpty()
  @Length(3, 255)
  en_title: string;

  @IsNotEmpty()
  en_description: string;

  @IsNotEmpty()
  @Length(3, 255)
  uz_title: string;

  @IsNotEmpty()
  uz_description: string;

  @IsNotEmpty()
  fixed_delivery_price: string;

  thumbnail: string;
}