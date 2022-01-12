import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CurrentUser } from '../dto/current-user.dto';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
