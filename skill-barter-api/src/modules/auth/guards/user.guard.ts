import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (user && params?.id && user?.id === Number(params?.id)) {
      return true;
    } else {
      throw new ForbiddenException('You do not own this resource');
    }
  }
}
