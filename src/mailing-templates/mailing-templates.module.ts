import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingTemplatesController } from './mailing-templates.controller';
import { MailingTemplatesService } from './mailing-templates.service';
import { MailingTemplate } from './mailing-template.entity';
import { isMailingTemplateExists } from './validators';
import { MailingTemplatesCrudService } from './mailing-templates-crud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailingTemplate]),
  ],
  controllers: [MailingTemplatesController],
  providers: [MailingTemplatesCrudService, MailingTemplatesService, isMailingTemplateExists],
  exports: [MailingTemplatesService]
})
export class MailingTemplatesModule {}
