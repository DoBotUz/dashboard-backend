import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
// import { OrganizationsService } from 'src/organizations/organizations.service';

@ValidatorConstraint({ name: 'IsAllowedBranch', async: true })
@Injectable()
export class IsAllowedBranch implements ValidatorConstraintInterface {
  // constructor(private organizationsService: OrganizationsService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    // const organization = await this.organizationsService.findOne(id);
    // return Boolean(organization);
  }
  defaultMessage(): string {
    return 'Organization does not exist';
  }
}