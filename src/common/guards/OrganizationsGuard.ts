import { Injectable, CanActivate, ExecutionContext, Scope } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable({ scope: Scope.REQUEST })
export class OrganizationGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      return false;
    }
    const organizationId = request.params.organizationId;
    const userEntity = await this.usersService.findOneWithOrganizations(user.id);
    return userEntity.organizations.some(org => org.id == organizationId);
  }
}
