import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingTemplatesController } from './mailing-templates.controller';
import { MailingTemplatesService } from './mailing-templates.service';
import { MailingTemplate } from './mailing-template.entity';
import { isMailingTemplateExists } from './validators';
import { MailingTemplatesCrudService } from './mailing-templates-crud.service';
import { BotNotificationsModule } from 'src/bot-notifications/bot-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailingTemplate]),
    BotNotificationsModule,
  ],
  controllers: [MailingTemplatesController],
  providers: [MailingTemplatesCrudService, MailingTemplatesService, isMailingTemplateExists],
  exports: [MailingTemplatesService]
})
export class MailingTemplatesModule {}
