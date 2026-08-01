import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { createGqlExecutionContext } from '../../testing/gql-execution-context';

describe('IsAuthenticatedGuard', () => {
  let guard: IsAuthenticatedGuard;

  beforeEach(() => {
    guard = new IsAuthenticatedGuard();
  });

  it('activates when req.user is set', () => {
    const context = createGqlExecutionContext({ req: { user: { id: 1 } } });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('does not activate when req.user is missing', () => {
    const context = createGqlExecutionContext({ req: {} });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('does not activate when req.user is null', () => {
    const context = createGqlExecutionContext({ req: { user: null } });
    expect(guard.canActivate(context)).toBe(false);
  });
});
