import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { Observable } from "rxjs";
import { jwtConstants } from "src/auth/constants";
import * as jwt from 'jsonwebtoken';
import { WsException } from "@nestjs/websockets";
import { User } from "src/users/user.entity";
import { Socket } from 'socket.io';


@Injectable()
export class WsJwtGuard implements CanActivate {

  constructor(private userService: UsersService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken: string = client.handshake?.query?.authorization;
      const organizationId: Number = client.handshake?.query?.organizationId;
      const bearerToken = authToken.split(' ')[1];
      const decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
      const user: User = await this.userService.findOneByEmail(decoded.email);

      if (!user.organizations.find(org => org.id == organizationId)) {
        return false;
      }

      client.join(`org_id_${organizationId}`);
      context.switchToHttp().getRequest().user = user

      return Boolean(user);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

}