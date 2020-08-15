import { Module } from '@nestjs/common';
import { BotsGatewayModule } from './bots/bots-gateway.module';
import { FrontendModule } from './frontend/frontend.module';

@Module({
  imports: [BotsGatewayModule, FrontendModule],
})
export class GatewaysModule {}
