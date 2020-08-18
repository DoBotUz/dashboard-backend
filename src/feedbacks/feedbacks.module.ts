import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { isFeedbackExists } from './validators';
import { FeedbacksCrudService } from './feedbacks-crud.service';
import { MailingTemplatesModule } from 'src/mailing-templates/mailing-templates.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), MailingTemplatesModule],
  providers: [FeedbacksCrudService, FeedbacksService, isFeedbackExists],
  controllers: [FeedbacksController],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
