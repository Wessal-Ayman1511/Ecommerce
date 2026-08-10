import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenRepository, UserRepository } from 'src/DB/repositories';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthenticationGaurd implements CanActivate {
  constructor(
    private readonly _JwtService: JwtService,
    private readonly _ConfigService: ConfigService,
    private readonly _UserRepository: UserRepository,
    private readonly _TokenRepository: TokenRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = this.getTokenFromReq(req);
    if (!token) throw new UnauthorizedException('Token Required!');

    try {
      const payload = this._JwtService.verify(token, {
        secret: this._ConfigService.get('JWT_SECRET'),
      });
      const user = await this._UserRepository.findOne({
        filter: { _id: payload.id },
      });
      if (!user) throw new NotFoundException('User not found!');

      const validToken = await this._TokenRepository.findOne({
        filter: {
          token: token,
          isValid: true,
          user: user._id,
        },
      });
      if (!validToken) throw new UnauthorizedException('Invalid Bearer Token');

      req.user = user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private getTokenFromReq(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type == 'Bearer' ? token : undefined;
  }
}
