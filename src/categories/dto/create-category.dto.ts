import { BaseCategoryDto } from './base-category.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsOrganizationExists } from 'src/organizations/validators';

export class CreateCategoryDto extends BaseCategoryDto {
  @IsNotEmpty()
  @Validate(IsOrganizationExists)
  organizationId: number;
}