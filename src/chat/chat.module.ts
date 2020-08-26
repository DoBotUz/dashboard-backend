import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { FrontendModule } from "src/gateways/frontend/frontend.module";
import { BotsGatewayModule } from "src/gateways/bots/bots-gateway.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    FrontendModule,
    BotsGatewayModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class ChatModule {}
