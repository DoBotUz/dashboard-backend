import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotNotificationsService } from './bot-notifications.service';
import { BotNotificationsController } from './bot-notifications.controller';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { isBotNotificationExists, isBotNotificationTemplateExists } from './validators';
import { BotNotificationsCrudService } from './bot-notifications-crud.service';
import { BotNotificationBotUser } from './bot-notification-bot-user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([BotNotification]),
    TypeOrmModule.forFeature([BotNotificationTemplate]),
    TypeOrmModule.forFeature([BotNotificationBotUser]),
  ],
  providers: [BotNotificationsCrudService, BotNotificationsService, isBotNotificationExists, isBotNotificationTemplateExists],
  controllers: [BotNotificationsController],
  exports: [BotNotificationsService]
})
export class BotNotificationsModule {}
