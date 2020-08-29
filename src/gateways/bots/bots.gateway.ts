import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger, ValidationPipe, UsePipes, UseFilters, Inject, forwardRef } from '@nestjs/common';
import { LocalhostGuard } from 'src/common/guards/localhost.guard';
import { BotsService } from 'src/bots/bots.service';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/validation-exception';
import { NewNotificationDto } from './dto/new-notification.dto';
import AllWsExceptionsFilter from 'src/all-ws-exceptions.filter';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Message } from 'src/chat/message.entity';
import { MessagesService } from 'src/chat/messages.service';

@UseGuards(LocalhostGuard)
@UseFilters(new AllWsExceptionsFilter())
@WebSocketGateway({ namespace: 'bots' })
export class BotsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private botsService: BotsService,
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => MessagesService))
    private messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('BotsGateway');

  newBot(@MessageBody() data: any): void {
    if(this.server) {
      this.server.emit('newBot', data);
    }
  }

  botStatusChange(@MessageBody() data: any): void {
    if(this.server) {
      this.server.emit('botStatusChange', data);
    }
  }

  newBotNotification(@MessageBody() data: any): void {
    if(this.server) {
      this.server.emit('newBotNotification', data);
    }
  }

  @SubscribeMessage('botOnline')
  async handleBotOnline(@MessageBody() data: string): Promise<void> {
    const bot_id = Number(data);
    this.botsService.setIsOnline(bot_id, true);
  }

  @SubscribeMessage('botOfline')
  async handleBotOffline(@MessageBody() data: string): Promise<void> {
    const bot_id = Number(data);
    this.botsService.setIsOnline(bot_id, false);
  }

  @SubscribeMessage('newNotification')
  @UsePipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
         return new ValidationException(validationErrors);
       }
    }
  ))
  async handleNewNotification(@MessageBody() data: NewNotificationDto): Promise<void> {
    this.notificationsService.notify(data.org_id, data.notification.key, data.notification.key_id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleChatMessage(data: Message) {
    this.server.emit('newChatMessage', JSON.stringify(data));
  }

  @SubscribeMessage('newMessage')
  async newMessage(@MessageBody() data: Message) {
    this.messagesService.newMessage(data);
  }
}
