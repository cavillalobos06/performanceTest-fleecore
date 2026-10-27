import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Rol } from '../enum.js';

export interface AuthUser {
  id: number;
  correo: string;
  role: Rol;
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as AuthUser;
    return field ? user?.[field] : user;
  },
);
