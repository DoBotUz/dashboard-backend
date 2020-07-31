import { Module, Global } from '@nestjs/common';
import { BotsGateway } from './bots.gateway';

@Global()
@Module({
  providers: [BotsGateway],
  exports: [BotsGateway],
})
export class BotsModule {}
