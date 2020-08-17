import { IsNotEmpty, Validate, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { isFeedbackExists } from '../validators';
import { STATUSES } from '../feedback.entity';

export class UpdateFeedbackStatusDto {
  @IsNotEmpty()
  @Validate(isFeedbackExists)
  id: number;

  @IsNotEmpty()
  @Transform((value) => {
    return Number(value)
  })
  @IsNumber()
  @IsIn(Object.values(STATUSES))
  status: number;
}