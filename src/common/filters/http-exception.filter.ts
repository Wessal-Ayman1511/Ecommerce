import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const errorRes = exception.getResponse();

      if (typeof errorRes == 'string') message = errorRes;
      else if (
        typeof errorRes == 'object' &&
        errorRes !== null &&
        'message' in errorRes
      )
        message = errorRes.message as string;
    }
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });
  }
}
