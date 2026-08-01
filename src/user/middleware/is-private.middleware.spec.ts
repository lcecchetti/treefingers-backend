import { ForbiddenException } from '@nestjs/common';
import { MiddlewareContext } from '@nestjs/graphql';
import { isPrivateMiddleware } from './is-private.middleware';

function createContext(source: any, user?: any): MiddlewareContext {
  return {
    source,
    args: {},
    context: { req: { user } },
    info: { fieldName: 'email' },
  } as unknown as MiddlewareContext;
}

describe('isPrivateMiddleware', () => {
  it('rejects when there is no current user', async () => {
    const next = jest.fn();
    const ctx = createContext({ id: 1 }, undefined);

    await expect(isPrivateMiddleware(ctx, next)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects when the current user is not the field owner', async () => {
    const next = jest.fn();
    const ctx = createContext({ id: 1 }, { id: 2 });

    await expect(isPrivateMiddleware(ctx, next)).rejects.toThrow(
      'User does not have sufficient permissions to access "email" field.',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('resolves the field for its owner', async () => {
    const next = jest.fn().mockResolvedValue('ada@example.com');
    const ctx = createContext({ id: 1 }, { id: 1 });

    await expect(isPrivateMiddleware(ctx, next)).resolves.toBe(
      'ada@example.com',
    );
    expect(next).toHaveBeenCalled();
  });
});
