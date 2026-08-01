import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

function createConfigService(secret: string | undefined) {
  return { get: jest.fn().mockReturnValue(secret) } as unknown as ConfigService;
}

describe('JwtStrategy', () => {
  it('throws at construction time when no secret is configured', () => {
    expect(() => new JwtStrategy(createConfigService(undefined))).toThrow(
      'JWT_SECRET must be set.',
    );
  });

  it('builds successfully when a secret is configured', () => {
    expect(
      () => new JwtStrategy(createConfigService('test-secret')),
    ).not.toThrow();
  });

  describe('validate', () => {
    let strategy: JwtStrategy;

    beforeEach(() => {
      strategy = new JwtStrategy(createConfigService('test-secret'));
    });

    it('returns the current user shape for an access token', async () => {
      const payload = {
        sub: 1,
        email: 'ada@example.com',
        username: 'ada',
        type: 'access' as const,
      };

      await expect(strategy.validate(payload)).resolves.toEqual({
        id: 1,
        email: 'ada@example.com',
        username: 'ada',
      });
    });

    it('rejects a token that is not an access token', async () => {
      const payload = {
        sub: 1,
        email: 'ada@example.com',
        username: 'ada',
        type: 'reset' as any,
      };

      await expect(strategy.validate(payload)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
