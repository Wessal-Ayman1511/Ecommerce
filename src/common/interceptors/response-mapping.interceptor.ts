import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";


@Injectable()
export class ResponseMappingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {


        return next.handle().pipe(
            //tap((res) => {console.log(`response before edit: ${res}`)}),
            map((res) => ({
                success: true,
                message: res.message || '',
                data: res.data || [],
                Date: new Date()
                
            })),
            //tap((res) => {console.log(`response after edit: ${res}`)}),
        )
        
    }
}