import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BranchesService } from '../branches.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsBranchExists', async: true })
@Injectable()
export class IsBranchExists implements ValidatorConstraintInterface {
  constructor(private branchesService: BranchesService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const category = await this.branchesService.findOne(id);
    return Boolean(category);
  }
  defaultMessage(): string {
    return 'Branch does not exist';
  }
}