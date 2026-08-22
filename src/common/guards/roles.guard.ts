import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../decorators';
import { IS_GRAPHQL } from '../decorators/graphql-decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isGraphql = this.reflector.getAllAndOverride(IS_GRAPHQL, [
      context.getHandler(),
      context.getClass(),
    ]);

    let req;

    if (isGraphql) {
      let cxt = GqlExecutionContext.create(context).getContext();
      req = cxt.req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const requiredRoles = this.reflector.getAllAndMerge(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = req;

    if (requiredRoles?.length) {
      if (!requiredRoles.includes(user?.role))
        throw new UnauthorizedException("You Aren't Authorized!!");
    }

    return true;
  }
}
