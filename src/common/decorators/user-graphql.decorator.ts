import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";



export const User = createParamDecorator((data: string, cxt: ExecutionContext)=>{

    const graphqlcxt = GqlExecutionContext.create(cxt).getContext()

    const {user} = graphqlcxt.req

    return data ? user?.[data] : user
})