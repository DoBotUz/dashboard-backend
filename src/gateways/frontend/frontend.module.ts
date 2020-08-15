import { Module, Global } from '@nestjs/common';
import { FrontendGateway } from './frontend.gateway';

@Global()
@Module({
  providers: [FrontendGateway],
  exports: [FrontendGateway],
})
export class FrontendModule {}
