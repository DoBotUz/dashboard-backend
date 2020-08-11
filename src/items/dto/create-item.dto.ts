import { BaseItemDto } from './base-item.dto';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsOrganizationExists } from 'src/organizations/validators';

export class CreateItemDto extends BaseItemDto {
  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @Validate(IsOrganizationExists)
  organizationId: number;
}