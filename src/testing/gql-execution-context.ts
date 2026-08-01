import { ExecutionContext } from '@nestjs/common';

// Minimal ExecutionContext double satisfying GqlExecutionContext.create(),
// which reads getType()/getArgs() and expects the GraphQL resolver argument
// shape [root, args, context, info].
export function createGqlExecutionContext(
  context: Record<string, any> = {},
  args: Record<string, any> = {},
): ExecutionContext {
  return {
    getType: () => 'graphql',
    getArgs: () => [undefined, args, context, undefined],
    getClass: () => class {},
    getHandler: () => () => {},
  } as unknown as ExecutionContext;
}
