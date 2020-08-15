import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { BotUsersModule } from 'src/bot-users/bot-users.module';
import { BotsService } from 'src/bots/bots.service';
import { BotsModule } from 'src/bots/bots.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), OrdersModule, FeedbacksModule, BotUsersModule, BotsModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
