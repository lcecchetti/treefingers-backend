import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // authentication is optional here: no/invalid/expired tokens just leave
  // req.user unset (info/err from passport-jwt in that case), letting public
  // queries resolve anonymously. IsAuthenticatedGuard is what actually
  // enforces auth on protected resolvers. A genuine unexpected error from the
  // strategy (not "no token"/"bad token") should still surface, not be
  // swallowed as if the user were merely unauthenticated.
  handleRequest(err, user) {
    if (err) {
      throw err;
    }
    return user;
  }
}
