import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class BaseUserDTO {
  @IsNotEmpty()
  @Length(3,255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(1,255)
  first_name: string;

  @IsNotEmpty()
  @Length(1,255)
  last_name: string;

  avatar: string;
  password_hash: string;
}
