import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { MailingTemplatesService } from '../mailing-templates.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isMailingTemplateExists', async: true })
@Injectable()
export class isMailingTemplateExists implements ValidatorConstraintInterface {
  constructor(private modelService: MailingTemplatesService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const model = await this.modelService.findOne(id);
    return Boolean(model);
  }
  defaultMessage(): string {
    return 'MailingTemplate does not exist';
  }
}