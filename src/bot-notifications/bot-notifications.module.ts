import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotNotificationsService } from './bot-notifications.service';
import { BotNotificationsController } from './bot-notifications.controller';
import { BotNotification } from './bot-notification.entity';
import { BotNotificationTemplate } from './bot-notification-template.entity';
import { isBotNotificationExists, isBotNotificationTemplateExists } from './validators';
import { BotNotificationBotUser } from './bot-notification-bot-user.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([BotNotification]), SequelizeModule.forFeature([BotNotificationTemplate]), SequelizeModule.forFeature([BotNotificationBotUser])],
  providers: [BotNotificationsService, isBotNotificationExists, isBotNotificationTemplateExists],
  controllers: [BotNotificationsController],
  exports: [BotNotificationsService]
})
export class BotNotificationsModule {}
