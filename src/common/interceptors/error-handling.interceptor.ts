// import {
//   CallHandler,
//   ExecutionContext,
//   HttpException,
//   Injectable,
//   InternalServerErrorException,
//   NestInterceptor,
// } from '@nestjs/common';
// import { catchError, map, Observable, tap } from 'rxjs';

// @Injectable()
// export class ErrorHandlingInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> {
//     return next.handle().pipe(
//       catchError((error) => {

//         const res = context.switchToHttp().getResponse()
//         const errorDetails = {
//             success: false,
//             statusCode: 500,
//             error: error.message,
//             stack: error.stack
//           }
        
//         if (error instanceof HttpException)
//             throw error

//         throw new InternalServerErrorException(errorDetails);
//       }),
//     );
//   }
// }
