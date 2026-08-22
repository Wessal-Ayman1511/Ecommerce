import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable, tap } from "rxjs";
import { SKIP_INTERCEPTOR } from "../decorators/skip-interceptor.decorator";


@Injectable()
export class ResponseMappingInterceptor implements NestInterceptor{
    constructor(private readonly reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {

        const skip = this.reflector.getAllAndOverride(SKIP_INTERCEPTOR, [
            context.getHandler(),
            context.getClass()
        ])
        if(skip) return next.handle()


        return next.handle().pipe(
            //tap((res) => {console.log(`response before edit: ${res}`)}),
            map((res) => ({
                success: true,
                message: res?.message || '',
                data: res?.data || [],
                Date: new Date()
                
            })),
            //tap((res) => {console.log(`response after edit: ${res}`)}),
        )
        
    }
}