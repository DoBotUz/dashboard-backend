import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JSendResInterceptor implements NestInterceptor {
  private readonly logger = new Logger(JSendResInterceptor.name);
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const [req] = ctx.getArgs();
    let user_message = '';
    if (req.user) {
      user_message = req.user.email;
    }
    this.logger.debug(`Request ${req.method} for ${req.url}. ${user_message} ${req.connection.remoteAddress}`);
    return next.handle().pipe(map((data) => ({
      status: 'Success',
      data,
    })));
  }
}
