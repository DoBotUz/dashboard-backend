import { IsNotEmpty, Validate, IsOptional } from 'class-validator';
import { IsBotUserExists } from '../validators/isBotUserExists';

export class UpdateBotUserDto {
  @IsNotEmpty()
  @Validate(IsBotUserExists)
  id: number;

  @IsOptional()
  comment: string;
}