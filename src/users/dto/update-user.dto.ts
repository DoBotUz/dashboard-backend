import { Validate, IsNotEmpty, IsOptional, Length, IsIn } from 'class-validator';
import { IsUserExists } from "../validators";
import { BaseUserDto } from "./base-user.dto";

export class UpdateUserDto extends BaseUserDto{
  @IsNotEmpty()
  @Validate(IsUserExists)
  id: number;

  @IsNotEmpty()
  @IsIn(["0", "10", "20"])
  status: string;

  @IsOptional()
  @Length(3, 255)
  password: string;
}