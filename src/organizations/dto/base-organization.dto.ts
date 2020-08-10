import { IsNotEmpty, Length, Validate, ValidateNested } from 'class-validator';
import { IsUserExists } from 'src/users/validators';

export class BaseBotDto {
  @IsNotEmpty()
  @Length(3, 512)
  token: string;
}

class User {
  @IsNotEmpty()
  @Validate(IsUserExists)
  id: number;
}

export class BaseOrganizationDTO {
  @IsNotEmpty()
  @ValidateNested()
  user: User;

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