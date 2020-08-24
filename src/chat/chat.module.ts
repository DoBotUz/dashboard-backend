import { Module } from "@nestjs/common";
import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { GatewaysModule } from "src/gateways/gateways.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    GatewaysModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class ChatModule {}
