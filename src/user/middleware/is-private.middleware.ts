import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const isPrivateMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info, context, source } = ctx;
  const currentUser = context.req.user;

  if (!currentUser || !source.id === currentUser.id) {
    throw new ForbiddenException(
      `User does not have sufficient permissions to access "${info.fieldName}" field.`,
    );
  }

  return next();
};
