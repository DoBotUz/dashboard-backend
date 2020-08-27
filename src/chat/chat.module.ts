import { Module, forwardRef } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { FrontendModule } from "src/gateways/frontend/frontend.module";
import { BotsGatewayModule } from "src/gateways/bots/bots-gateway.module";
import { BotUsersModule } from "src/bot-users/bot-users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    FrontendModule,
    forwardRef(() => BotsGatewayModule),
    BotUsersModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class ChatModule {}
