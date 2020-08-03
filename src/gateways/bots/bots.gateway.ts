import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { OrdersService } from 'src/orders/orders.service';

import { Server } from 'socket.io';

@WebSocketGateway()
export class BotsGateway {
  constructor(
    private ordersService: OrdersService,
  ) {}

  @WebSocketServer()
  server: Server;

  newBot(@MessageBody() data: any): void {
    this.server.emit('newBot', data);
  }

  @SubscribeMessage('newOrder')
  async handleNewOrder(@MessageBody() data: string): Promise<void> {
    const order_id = Number(data);
    const order = await this.ordersService.findOne(order_id);
    if (!order) {
      return;
    }
    
  }
}