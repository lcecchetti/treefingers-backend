import { LocalAuthGuard } from './local-auth.guard';
import { createGqlExecutionContext } from '../../testing/gql-execution-context';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(() => {
    guard = new LocalAuthGuard();
  });

  describe('getRequest', () => {
    it('maps the GraphQL login input onto req.body for passport-local', () => {
      const req: any = {};
      const context = createGqlExecutionContext(
        { req },
        { input: { email: 'ada@example.com', password: 'hunter2' } },
      );

      const result = guard.getRequest(context);

      expect(result).toBe(req);
      expect(req.body).toEqual({
        username: 'ada@example.com',
        password: 'hunter2',
      });
    });
  });
});
