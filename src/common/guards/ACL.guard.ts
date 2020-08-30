import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { getFeature, getAction } from "@nestjsx/crud";
import { User } from "src/users/user.entity";
import { RolesBuilder, InjectRolesBuilder } from "nest-access-control";

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

    console.log(request.params);
    this.logger.log(`${feature} - ${action}`);
    if (!crudAction){
      this.logger.log(`No action translation found: ${feature} - ${action}`);
      return false;
    }

    for(let i = 0; i < user.roles.length; i++){
      const role = user.roles[i];
      if(this.roleBuilder.can(role)[crudAction](feature).granted){
        return true;
      }
    }
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