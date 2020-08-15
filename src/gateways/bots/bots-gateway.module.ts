import { Module, Global } from '@nestjs/common';
import { BotsGateway } from './bots.gateway';
import { BotsModule } from 'src/bots/bots.module';

@Global()
@Module({
  providers: [BotsGateway],
  imports: [BotsModule],
  exports: [BotsGateway],
})
export class BotsGatewayModule {}
