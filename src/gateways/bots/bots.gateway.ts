import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway()
export class BotsGateway {
  @WebSocketServer()
  server: Server;

  newBot(@MessageBody() data: any): void {
    this.server.emit('newBot', data);
  }
}