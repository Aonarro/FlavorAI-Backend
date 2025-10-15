import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtUserPayload } from '../types/jwt.type';

export const User = createParamDecorator<keyof JwtUserPayload | undefined>(
  (data: keyof JwtUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtUserPayload }>();
    const user = request.user;

    if (!user) throw new Error('User not found in request');
    if (data) return user[data];
    return user;
  },
);
