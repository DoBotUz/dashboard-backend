import { IsNotEmpty, Validate, IsIn, IsNumber } from 'class-validator';
import { BaseBranchDto } from './base-branch.dto';
import { IsBranchExists } from '../validators';
import { STATUSES } from '../branch.entity';
import { Transform } from 'class-transformer';

export class UpdateBranchDto extends BaseBranchDto {
  @IsNotEmpty()
  @Validate(IsBranchExists)
  id: number;
}

export class UpdateBranchStatusDto {
  @IsNotEmpty()
  @Validate(IsBranchExists)
  id: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}