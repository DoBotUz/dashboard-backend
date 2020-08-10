import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { isFeedbackExists } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  providers: [FeedbacksService, isFeedbackExists],
  controllers: [FeedbacksController]
})
export class FeedbacksModule {}
