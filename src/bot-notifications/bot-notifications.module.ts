import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotNotificationsService } from './bot-notifications.service';
import { BotNotificationsController } from './bot-notifications.controller';
import { BotNotification } from './bot-notification.entity';
import { isBotNotificationExists } from './validators';
import { BotNotificationsCrudService } from './bot-notifications-crud.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([BotNotification]),
  ],
  providers: [BotNotificationsCrudService, BotNotificationsService, isBotNotificationExists],
  controllers: [BotNotificationsController],
  exports: [BotNotificationsService]
})
export class BotNotificationsModule {}
