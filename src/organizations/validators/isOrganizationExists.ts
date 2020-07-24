import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { OrganizationsService } from '../organizations.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsOrganizationExists', async: true })
@Injectable()
export class IsOrganizationExists implements ValidatorConstraintInterface {
  constructor(private organizationsService: OrganizationsService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const organization = await this.organizationsService.findOne(id);
    return Boolean(organization);
  }
  defaultMessage(): string {
    return 'Organization does not exist';
  }
}