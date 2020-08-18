import { IsNotEmpty, Validate } from 'class-validator';
import { BaseMailingTemplateDto } from './base-mailing-template.dto';
import { isMailingTemplateExists } from '../validators';

export class UpdateMailingTemplateDto extends BaseMailingTemplateDto {
  @IsNotEmpty()
  @Validate(isMailingTemplateExists)
  id: number;
}