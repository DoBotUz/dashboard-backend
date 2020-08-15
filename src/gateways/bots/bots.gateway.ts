import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { OrdersService } from 'src/orders/orders.service';

import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { LocalhostGuard } from 'src/common/guards/localhost.guard';
import { BotsService } from 'src/bots/bots.service';

@UseGuards(LocalhostGuard)
@WebSocketGateway(3000, { namespace: 'bots' })
export class BotsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private ordersService: OrdersService,
    private botsService: BotsService,
  ) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('BotsGateway');

  newBot(@MessageBody() data: any): void {
    if(this.server) {
      this.server.emit('newBot', data);
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

  @SubscribeMessage('newOrder')
  async handleNewOrder(@MessageBody() data: string): Promise<void> {
    const order_id = Number(data);
    const order = await this.ordersService.findOne(order_id);
    if (!order) {
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   }
  
   handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
   }
}