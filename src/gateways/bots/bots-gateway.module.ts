import { Module, Global } from '@nestjs/common';
import { BotsGateway } from './bots.gateway';
import { BotsModule } from 'src/bots/bots.module';
import { AreValidKeys } from './validators/AreValidKeys';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Global()
@Module({
  providers: [BotsGateway, AreValidKeys],
  imports: [BotsModule, NotificationsModule],
  exports: [BotsGateway],
})
export class BotsGatewayModule {}
