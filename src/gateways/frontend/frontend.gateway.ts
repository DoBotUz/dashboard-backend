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
@WebSocketGateway({ namespace: 'frontend' })
export class FrontendGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('FrontendGateway');

  notifyUsers(org_id: number, notif: any) {
    if (this.server) {
      this.server.to(`org_id_${org_id}`).emit('newNotification', JSON.stringify(notif));
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // private findSocketByUserId(user_id: number): string {
  //   for( const socketId in this.server.sockets) {
  //     if(this.server.sockets[socketId].user && this.server.sockets[socketId].user.id == user_id){
  //       return socketId;
  //     }
  //   }
  // }
}