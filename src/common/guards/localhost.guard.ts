import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class LocalhostGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const socket = ctx.switchToWs().getClient();
    
    return socket.handshake.address === '::ffff:127.0.0.1';
  }
}
