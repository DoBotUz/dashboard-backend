import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { isFeedbackExists } from './validators';
import { FeedbacksCrudService } from './feedbacks-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  providers: [FeedbacksCrudService, FeedbacksService, isFeedbackExists],
  controllers: [FeedbacksController]
})
export class FeedbacksModule {}
