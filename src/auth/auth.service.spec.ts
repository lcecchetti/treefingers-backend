jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('dummy-hash'),
  compare: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let configService: any;
  let jwtService: any;
  let mailerService: any;
  let notificationService: any;
  let urlService: any;

  beforeEach(() => {
    jest.clearAllMocks();

    userService = {
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      edit: jest.fn(),
    };
    configService = {
      get: jest.fn().mockReturnValue('https://treefingers.test'),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('signed.jwt.token'),
      verify: jest.fn(),
    };
    mailerService = { sendMail: jest.fn().mockResolvedValue(undefined) };
    notificationService = { create: jest.fn() };
    urlService = { getStoryNewUrl: jest.fn().mockReturnValue('/story/new') };

    authService = new AuthService(
      userService,
      configService,
      jwtService,
      mailerService,
      notificationService,
      urlService,
    );
  });

  describe('validateUser', () => {
    const password = 'correct-password';
    const user = {
      id: 1,
      email: 'ada@example.com',
      password: 'hashed-password',
      isBanned: false,
      isActive: true,
    };

    it('returns the user when credentials are valid', async () => {
      userService.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateUser(user.email, password),
      ).resolves.toBe(user);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('still runs bcrypt.compare against a dummy hash when no user exists (timing-safe)', async () => {
      userService.findOne.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser('nobody@example.com', password),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'dummy-hash');
    });

    it('rejects with the same generic message on a wrong password', async () => {
      userService.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser(user.email, 'wrong'),
      ).rejects.toThrow('User or password are not valid.');
    });

    it('rejects a banned user with the same generic message (no account-existence leak)', async () => {
      userService.findOne.mockResolvedValue({ ...user, isBanned: true });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateUser(user.email, password),
      ).rejects.toThrow('User or password are not valid.');
    });

    it('rejects an inactive user only after the password has been confirmed correct', async () => {
      userService.findOne.mockResolvedValue({ ...user, isActive: false });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        authService.validateUser(user.email, password),
      ).rejects.toThrow('Your account is not active yet, check your emails.');
    });
  });

  describe('login', () => {
    it('signs a JWT, updates lastLogin, and returns the token with the current user', async () => {
      const user = {
        id: 1,
        email: 'ada@example.com',
        username: 'ada',
      } as any;

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        username: user.username,
        type: 'access',
      });
      expect(userService.edit).toHaveBeenCalledWith(
        user.id,
        expect.objectContaining({ lastLogin: expect.any(Date) }),
      );
      expect(result).toEqual({
        token: 'signed.jwt.token',
        currentUser: user,
      });
    });
  });

  describe('register', () => {
    it('creates the user and sends the activation email', async () => {
      const data = { email: 'ada@example.com' } as any;
      userService.create.mockResolvedValue(undefined);
      userService.findOne.mockResolvedValue({
        id: 1,
        email: data.email,
        isActive: false,
      });

      const result = await authService.register(data);

      expect(userService.create).toHaveBeenCalledWith(data);
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: data.email,
          template: 'activate-account',
        }),
      );
      expect(result).toEqual({ result: true });
    });
  });

  describe('forgotPassword', () => {
    it('emails a reset link when the user exists and is not banned', async () => {
      const user = { id: 1, tokenVersion: 0, isBanned: false };
      userService.findOne.mockResolvedValue(user);

      const result = await authService.forgotPassword({
        email: 'ada@example.com',
      });

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, tokenVersion: user.tokenVersion, type: 'reset' },
        { expiresIn: 60 * 15 },
      );
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ template: 'forgot-password' }),
      );
      expect(result).toEqual({ result: true });
    });

    it('does not email a banned user, but still reports success (no enumeration)', async () => {
      userService.findOne.mockResolvedValue({
        id: 1,
        tokenVersion: 0,
        isBanned: true,
      });

      const result = await authService.forgotPassword({
        email: 'ada@example.com',
      });

      expect(mailerService.sendMail).not.toHaveBeenCalled();
      expect(result).toEqual({ result: true });
    });

    it('reports success even when no such user exists (no enumeration)', async () => {
      userService.findOne.mockResolvedValue(null);

      const result = await authService.forgotPassword({
        email: 'nobody@example.com',
      });

      expect(mailerService.sendMail).not.toHaveBeenCalled();
      expect(result).toEqual({ result: true });
    });

    it('surfaces a mail failure as an InternalServerErrorException', async () => {
      userService.findOne.mockResolvedValue({
        id: 1,
        tokenVersion: 0,
        isBanned: false,
      });
      mailerService.sendMail.mockRejectedValue(new Error('smtp down'));

      await expect(
        authService.forgotPassword({ email: 'ada@example.com' }),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('changePassword', () => {
    it('rejects when the token fails verification', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(
        authService.changePassword({ token: 'bad', password: 'newpassword1' }),
      ).rejects.toThrow('This link has expired');
    });

    it('rejects a token that is not a reset token', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, type: 'access' });

      await expect(
        authService.changePassword({
          token: 'valid',
          password: 'newpassword1',
        }),
      ).rejects.toThrow('This link has expired');
    });

    it('rejects when the user no longer exists', async () => {
      jwtService.verify.mockReturnValue({
        sub: 1,
        type: 'reset',
        tokenVersion: 0,
      });
      userService.findById.mockResolvedValue(null);

      await expect(
        authService.changePassword({
          token: 'valid',
          password: 'newpassword1',
        }),
      ).rejects.toThrow('This link has expired');
    });

    it('rejects when the token version no longer matches (password already changed)', async () => {
      jwtService.verify.mockReturnValue({
        sub: 1,
        type: 'reset',
        tokenVersion: 0,
      });
      userService.findById.mockResolvedValue({ id: 1, tokenVersion: 1 });

      await expect(
        authService.changePassword({
          token: 'valid',
          password: 'newpassword1',
        }),
      ).rejects.toThrow('This link has expired');
    });

    it('updates the password when the token is valid', async () => {
      jwtService.verify.mockReturnValue({
        sub: 1,
        type: 'reset',
        tokenVersion: 0,
      });
      userService.findById.mockResolvedValue({ id: 1, tokenVersion: 0 });

      const result = await authService.changePassword({
        token: 'valid',
        password: 'newpassword1',
      });

      expect(userService.edit).toHaveBeenCalledWith(1, {
        password: 'newpassword1',
      });
      expect(result).toEqual({ result: true });
    });
  });

  describe('sendActivateAccountEmail', () => {
    it('returns false when there is no matching user', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        authService.sendActivateAccountEmail('nobody@example.com'),
      ).resolves.toBe(false);
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('returns false when the user is already active', async () => {
      userService.findOne.mockResolvedValue({ id: 1, isActive: true });

      await expect(
        authService.sendActivateAccountEmail('ada@example.com'),
      ).resolves.toBe(false);
      expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it('sends the activation email and returns true on success', async () => {
      userService.findOne.mockResolvedValue({ id: 1, isActive: false });

      await expect(
        authService.sendActivateAccountEmail('ada@example.com'),
      ).resolves.toBe(true);
      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'ada@example.com',
          template: 'activate-account',
        }),
      );
    });

    it('swallows a mail failure and returns false instead of throwing', async () => {
      userService.findOne.mockResolvedValue({ id: 1, isActive: false });
      mailerService.sendMail.mockRejectedValue(new Error('smtp down'));

      await expect(
        authService.sendActivateAccountEmail('ada@example.com'),
      ).resolves.toBe(false);
    });
  });

  describe('resendActivateAccount', () => {
    it('always reports success regardless of the underlying send result', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        authService.resendActivateAccount({ email: 'nobody@example.com' }),
      ).resolves.toEqual({ result: true });
    });
  });

  describe('activateAccount', () => {
    it('rejects when the token fails verification', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(
        authService.activateAccount({ token: 'bad' }),
      ).rejects.toThrow('This link has expired');
    });

    it('rejects a token that is not an activate token', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, type: 'access' });

      await expect(
        authService.activateAccount({ token: 'valid' }),
      ).rejects.toThrow('This link has expired');
    });

    it('404s when the user does not exist', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, type: 'activate' });
      userService.findById.mockResolvedValue(null);

      await expect(
        authService.activateAccount({ token: 'valid' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('404s when the user is already active', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, type: 'activate' });
      userService.findById.mockResolvedValue({ id: 1, isActive: true });

      await expect(
        authService.activateAccount({ token: 'valid' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('activates the user and sends a welcome notification', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, type: 'activate' });
      userService.findById.mockResolvedValue({
        id: 1,
        username: 'ada',
        isActive: false,
      });

      const result = await authService.activateAccount({ token: 'valid' });

      expect(userService.edit).toHaveBeenCalledWith(1, { isActive: true });
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.ACTIVATE_ACCOUNT,
          user: 1,
          link: '/story/new',
        }),
        true,
      );
      expect(result).toEqual({ result: true });
    });
  });
});
