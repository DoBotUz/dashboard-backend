import {
  Catch, ArgumentsHost, HttpException, HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export default class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : '';

    console.log(exception);
    // console.log(request.url);
    // if (status === 401) {
    //   response.status(401).json({
    //     status: 'Error',
    //   });
    // } else {
    //   response
    //     .status(HttpStatus.OK)
    //     .json({
    //       status: 'Error',
    //       message: `Forbidden. ${message}`,
    //     });
    // }
  }
}
