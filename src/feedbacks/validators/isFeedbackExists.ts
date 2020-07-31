import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { FeedbacksService } from '../feedbacks.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isFeedbackExists', async: true })
@Injectable()
export class isFeedbackExists implements ValidatorConstraintInterface {
  constructor(private modelService: FeedbacksService) {}
  async validate(id: number): Promise<boolean> {
    if(!id)
      return false;
    const model = await this.modelService.findOne(id);
    return Boolean(model);
  }
  defaultMessage(): string {
    return 'Feedback does not exist';
  }
}