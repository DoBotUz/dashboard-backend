import { IsNotEmpty, Validate, ValidateNested, IsOptional } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';
import { IsBotExists } from 'src/bots/validators';
import { BaseMailingTemplateDto } from '../../mailing-templates/dto/base-mailing-template.dto';

export class CreateMassSendDto {
  @IsNotEmpty()
  @Validate(IsBotExists)
  botId: number;

  @IsOptional()
  @Transform((value) => {
    return new Date(value)
  })
  after_date_time: Date;

  @IsNotEmpty()
  @Transform((value) => {
    return plainToClass(BaseMailingTemplateDto, JSON.parse(value));
  })
  @ValidateNested()
  template: BaseMailingTemplateDto;
}