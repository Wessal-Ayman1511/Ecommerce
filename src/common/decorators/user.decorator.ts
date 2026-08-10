import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const User = createParamDecorator((data: string, cxt: ExecutionContext)=>{

    const {user} = cxt.switchToHttp().getRequest()

    return data ? user?.[data] : user
})