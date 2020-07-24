import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserD = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <any>request.user;
  },
);