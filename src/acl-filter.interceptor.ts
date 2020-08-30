import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFeature, getAction } from '@nestjsx/crud';
import { User } from './users/user.entity';
import { Exception } from 'handlebars';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

@Injectable()
export class ACLFilterInterceptor implements NestInterceptor {
  constructor(@InjectRolesBuilder() private readonly roleBuilder: RolesBuilder) {}
  private readonly logger = new Logger(ACLFilterInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();
    const handler = ctx.getHandler();
    const controller = ctx.getClass();
    const user = <User>request.user;
    const feature = getFeature(controller);
    const action = getAction(handler);
    const crudAction = this.translateCrudActionToACL(action);

    let role = '';
    if(user && user.roles && user.roles.length)
      role = user.roles[0];

    if (!crudAction || !role){
      this.logger.log(`No action translation found: ${feature} - ${action}`);
    } else{
      
      const permission = this.roleBuilder.can(role)[crudAction](feature);
      return next.handle().pipe(map((data) => {
        return permission.filter(data);
      }));
    }
    return next.handle();
  }

  private translateCrudActionToACL(action: string): string{
    const translations = {
      'Read-Many': 'readAny',
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
