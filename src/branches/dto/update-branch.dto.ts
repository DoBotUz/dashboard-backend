import { IsNotEmpty, Validate } from 'class-validator';
import { BaseBranchDto } from './base-branch.dto';
import { IsBranchExists } from '../validators';

export class UpdateBranchDto extends BaseBranchDto {
  @IsNotEmpty()
  @Validate(IsBranchExists)
  id: number;
}