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
import { User } from 'src/users/user.entity';
import { jwtConstants } from "src/auth/constants";
import * as jwt from 'jsonwebtoken';
import { UsersService } from "src/users/users.service";

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'frontend' })
export class FrontendGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UsersService,
  ) {}

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

  async handleConnection(client: Socket, ...args: any[]) {
    const authToken: string = client.handshake?.query?.authorization;
    const organizationId: Number = client.handshake?.query?.organizationId;
    const bearerToken = authToken.split(' ')[1];
    const decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
    const user: User = await this.userService.findOneByEmail(decoded.email);

    if (!user || !user.organizations.find(org => org.id == organizationId)) {
      return client.disconnect();
    }

    client.join(`org_id_${organizationId}`);
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