import { JwtAuthGuard } from './jwt-auth.guard';
import { createGqlExecutionContext } from '../../testing/gql-execution-context';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  describe('getRequest', () => {
    it('extracts req from the GraphQL context', () => {
      const req = { headers: {} };
      const context = createGqlExecutionContext({ req });
      expect(guard.getRequest(context)).toBe(req);
    });
  });

  describe('handleRequest', () => {
    it('returns the user when there is no error', () => {
      const user = { id: 1 };
      expect(guard.handleRequest(null, user)).toBe(user);
    });

    it('returns undefined when there is no user and no error (anonymous access allowed)', () => {
      expect(guard.handleRequest(null, undefined)).toBeUndefined();
    });

    it('rethrows a genuine strategy error instead of swallowing it', () => {
      const error = new Error('unexpected strategy failure');
      expect(() => guard.handleRequest(error, undefined)).toThrow(error);
    });
  });
});
