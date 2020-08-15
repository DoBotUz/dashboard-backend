import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class LocalhostGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    
    return request.ip === '::1';
  }
}
