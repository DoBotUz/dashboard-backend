import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { getFeature, getAction } from "@nestjsx/crud";
import { User } from "src/users/user.entity";
import { RolesBuilder, InjectRolesBuilder } from "nest-access-control";
import { AppRoles } from "src/app.roles";

@Injectable()
export class ACLGuard implements CanActivate {
  constructor(@InjectRolesBuilder() private readonly roleBuilder: RolesBuilder) {}
  private logger: Logger = new Logger('ACLguard');

  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const controller = ctx.getClass();
    const request = ctx.switchToHttp().getRequest();
    const user = <User>request.user;
    const feature = getFeature(controller);
    const action = getAction(handler);
    const crudAction = this.translateCrudActionToACL(action);

    let { organizationId } = request.params;
    organizationId = Number(organizationId);

    if(!user.roles.includes(AppRoles.admin) && organizationId && !isNaN(organizationId) && organizationId !== user.organizationId){
      this.logger.log(`Forbidden action: ${feature} - ${action}\n ${user.email} tried to access not his organization!`);
      return false;
    }

    if (!crudAction){
      this.logger.log(`No action translation found: ${feature} - ${action}`);
      return false;
    }

    for(let i = 0; i < user.roles.length; i++){
      const role = user.roles[i];
      if(this.roleBuilder.can(role)[crudAction](feature).granted){
        this.logger.log(`Granted action: ${feature} - ${action}`);
        return true;
      }
    }

    this.logger.log(`Forbidden action: ${feature} - ${action}`);
    return false;
  }

  private translateCrudActionToACL(action: string): string{
    const translations = {
      'Read-All': 'readAny',
      'Read-One': 'readAny',
      'Create-One': 'createAny',
      'Create-Many': 'createAny',
      'Update-One': 'updateAny',
      'Replace-One': 'updateAny',
      'Delete-One': 'deleteAny',
    };

    if (!translations.hasOwnProperty(action)) {
      return null;
    }

    return translations[action];
  }
}