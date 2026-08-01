import { GqlThrottlerGuard } from './gql-throttler.guard';
import { createGqlExecutionContext } from '../../testing/gql-execution-context';

describe('GqlThrottlerGuard', () => {
  it('returns req/res pulled off the GraphQL request (express attaches res to req)', () => {
    const guard = Object.create(
      GqlThrottlerGuard.prototype,
    ) as GqlThrottlerGuard;
    const res = {};
    const req = { res };
    const context = createGqlExecutionContext({ req });

    expect(guard.getRequestResponse(context)).toEqual({ req, res });
  });
});
