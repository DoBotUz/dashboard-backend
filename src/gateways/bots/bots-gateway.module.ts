import { Module, Global } from '@nestjs/common';
import { BotsGateway } from './bots.gateway';
import { BotsModule } from 'src/bots/bots.module';
import { AreValidKeys } from './validators/AreValidKeys';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ChatModule } from 'src/chat/chat.module';

@Global()
@Module({
  providers: [BotsGateway, AreValidKeys],
  imports: [BotsModule, NotificationsModule, ChatModule],
  exports: [BotsGateway],
})
export class BotsGatewayModule {}
