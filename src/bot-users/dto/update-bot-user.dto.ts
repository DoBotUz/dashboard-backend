import { IsNotEmpty, Validate, IsOptional } from 'class-validator';
import { IsBotUserExists } from '../validators';

export class UpdateBotUserDTO {
  @IsNotEmpty()
  @Validate(IsBotUserExists)
  id: number;

  @IsOptional()
  comment: string;
}