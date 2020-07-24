import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class BaseUserDto {
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsNotEmpty()
  @Length(3, 255)
  username: string;

  @IsNotEmpty()
  @Length(3, 255)
  password: string;

  @IsNotEmpty()
  @Length(3, 255)
  position: string;

  @IsNotEmpty()
  @Length(3, 255)
  phone_number: string;

  avatar: string;
}