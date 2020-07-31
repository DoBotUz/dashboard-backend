import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Feedback } from './feedback.entity';

@Module({
  imports: [SequelizeModule.forFeature([Feedback])],
  providers: [FeedbacksService],
  controllers: [FeedbacksController]
})
export class FeedbacksModule {}
