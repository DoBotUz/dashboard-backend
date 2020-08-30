import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { getFeature, getAction } from "@nestjsx/crud";

@Injectable()
export class ACLGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const controller = ctx.getClass();

    const feature = getFeature(controller);
    const action = getAction(handler);

    console.log(`${feature}-${action}`); // e.g. 'Heroes-Read-All'

    return true;
  }
}