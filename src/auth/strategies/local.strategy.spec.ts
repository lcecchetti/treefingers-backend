import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  it('delegates credential validation to AuthService.validateUser', async () => {
    const user = { id: 1, email: 'ada@example.com' };
    const authService = {
      validateUser: jest.fn().mockResolvedValue(user),
    } as unknown as AuthService;

    const strategy = new LocalStrategy(authService);
    const result = await strategy.validate('ada@example.com', 'hunter2');

    expect(authService.validateUser).toHaveBeenCalledWith(
      'ada@example.com',
      'hunter2',
    );
    expect(result).toBe(user);
  });

  it('propagates rejection from AuthService.validateUser', async () => {
    const error = new Error('invalid credentials');
    const authService = {
      validateUser: jest.fn().mockRejectedValue(error),
    } as unknown as AuthService;

    const strategy = new LocalStrategy(authService);

    await expect(strategy.validate('ada@example.com', 'wrong')).rejects.toBe(
      error,
    );
  });
});
