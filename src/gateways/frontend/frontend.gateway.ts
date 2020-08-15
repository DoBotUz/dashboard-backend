import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from 'src/common/guards/wsjwt.guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway(3000, { namespace: 'frontend' })
export class FrontendGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FrontendGateway');


  @SubscribeMessage('events')
  onEvent(@ConnectedSocket() client: any, @MessageBody() data: unknown): string {
    return '123';
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   }
  
   handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
   }
}