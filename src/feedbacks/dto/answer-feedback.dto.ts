import { IsNotEmpty, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { isFeedbackExists } from '../validators';
import { CreateMailingTemplateDto } from 'src/mailing-templates/dto';


export class AnswerFeedbackDto {
  @IsNotEmpty()
  @Validate(isFeedbackExists)
  id: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMailingTemplateDto)
  template: CreateMailingTemplateDto;
}