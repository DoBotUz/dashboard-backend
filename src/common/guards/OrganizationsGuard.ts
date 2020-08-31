import { Injectable, CanActivate, ExecutionContext, Scope } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AppRoles } from "src/app.roles";

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
    const organizationId = Number(request.params.organizationId);
    if (user.role === AppRoles.admin) {
      const userEntity = await this.usersService.findOneWithOrganizations(user.id);
      return userEntity.organizations.some(org => org.id == organizationId);
    } else {
      return user.organizationId === organizationId;
    }
  }
}
