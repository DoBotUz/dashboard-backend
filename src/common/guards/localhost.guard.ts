import { Injectable, CanActivate, ExecutionContext, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class LocalhostGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest()
    console.log(request);

    return false;
  }
}
