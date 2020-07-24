import { IsNotEmpty, Validate } from 'class-validator';
import { BaseBranchDTO } from './base-Branch.dto';
import { IsBranchExists } from '../validators';

export class UpdateBranchDTO extends BaseBranchDTO {
  @IsNotEmpty()
  @Validate(IsBranchExists)
  id: number;
}