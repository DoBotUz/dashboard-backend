import { IsNotEmpty, Validate } from 'class-validator';
import { BaseBranchDTO } from './base-branch.dto';
import { IsBranchExists } from '../validators';

export class UpdateBranchDto extends BaseBranchDTO {
  @IsNotEmpty()
  @Validate(IsBranchExists)
  id: number;
}