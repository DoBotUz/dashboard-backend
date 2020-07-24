import { IsNotEmpty, Validate } from 'class-validator';
import { BaseOrganizationDTO } from './base-organization.dto';
import { IsOrganizationExists } from '../validators';

export class UpdateOrganizationDTO extends BaseOrganizationDTO {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  id: number;
}