import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from 'src/common/guards/wsjwt.guard';
import { Notification } from 'src/notifications/notification.entity';

@UseGuards(WsJwtGuard)
@WebSocketGateway(3000, { namespace: 'frontend' })
export class FrontendGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FrontendGateway');

  notifyUser(user_id: number, notif: Notification) {
    if(this.server) {
      console.log(user_id);
      const socketId = this.findSocketByUserId(user_id);
      if (socketId) {
        this.server.to(socketId).emit('newNotification', JSON.stringify(notif));
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  private findSocketByUserId(user_id: number): string {
    for( const socketId in this.server.sockets) {
      if(this.server.sockets[socketId].user && this.server.sockets[socketId].user.id == user_id){
        return socketId;
      }
    }
  }
}