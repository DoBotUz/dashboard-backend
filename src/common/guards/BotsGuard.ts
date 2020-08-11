import { Injectable, CanActivate, ExecutionContext, Scope } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable({ scope: Scope.REQUEST })
export class BotGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      return false;
    }
    const botId = request.params.botId;
    const userEntity = await this.usersService.findOneWithBots(user.id);
    return userEntity.organizations.some(org => org.bot.id == botId);
  }
}
