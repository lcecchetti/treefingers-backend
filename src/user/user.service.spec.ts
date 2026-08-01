jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('UserService', () => {
  let service: UserService;
  let repository: any;
  let paginationService: any;
  let queryService: any;
  let queryBuilder: ReturnType<typeof createQueryBuilderMock>;

  beforeEach(() => {
    jest.clearAllMocks();

    queryBuilder = createQueryBuilderMock();
    repository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      create: jest.fn((data) => data),
      getEntityManager: jest.fn().mockReturnValue({
        persist: jest.fn().mockReturnThis(),
        flush: jest.fn().mockResolvedValue(undefined),
      }),
    };
    paginationService = { paginate: jest.fn() };
    queryService = {
      prepareQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    service = new UserService(repository, paginationService, queryService);
  });

  describe('findOne / findMany / findById', () => {
    it('findOne resolves through the prepared query builder', async () => {
      const user = { id: 1 };
      queryBuilder.getSingleResult.mockResolvedValue(user);

      await expect(service.findOne({ id: { eq: 1 } } as any)).resolves.toBe(
        user,
      );
    });

    it('findMany resolves through the prepared query builder', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      queryBuilder.getResult.mockResolvedValue(users);

      await expect(service.findMany()).resolves.toBe(users);
    });

    it('findById filters by id equality', async () => {
      const user = { id: 5 };
      queryBuilder.getSingleResult.mockResolvedValue(user);

      await service.findById(5);

      expect(queryService.prepareQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        { id: { eq: 5 } },
        expect.anything(),
      );
    });
  });

  describe('create', () => {
    it('rejects when the email is already taken', async () => {
      queryBuilder.getSingleResult.mockResolvedValueOnce({ id: 1 });

      await expect(
        service.create({
          email: 'ada@example.com',
          username: 'ada',
          password: 'password123',
        } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects when the username is already taken', async () => {
      queryBuilder.getSingleResult
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce({ id: 1 }); // username check

      await expect(
        service.create({
          email: 'ada@example.com',
          username: 'ada',
          password: 'password123',
        } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('encrypts the password and persists a new user', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      const data = {
        email: 'ada@example.com',
        username: 'ada',
        password: 'password123',
      };

      const user = await service.create(data as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...data,
        password: 'hashed-password',
      });
      expect(user).toEqual({ ...data, password: 'hashed-password' });
    });
  });

  describe('edit', () => {
    it('throws NotFoundException when the user does not exist', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(service.edit(1, { bio: 'hi' } as any)).rejects.toThrow(
        'The user you are trying to edit does not exist.',
      );
    });

    it('encrypts a new password and bumps tokenVersion', async () => {
      const user = { id: 1, tokenVersion: 3 };
      queryBuilder.getSingleResult.mockResolvedValue(user);

      const result = await service.edit(1, {
        password: 'newpassword1',
      } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword1', 10);
      expect(result.tokenVersion).toBe(4);
      expect((result as any).password).toBe('hashed-password');
    });

    it('leaves tokenVersion untouched when no password is being changed', async () => {
      const user = { id: 1, tokenVersion: 3 };
      queryBuilder.getSingleResult.mockResolvedValue(user);

      const result = await service.edit(1, { bio: 'hello' } as any);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(result.tokenVersion).toBe(3);
      expect((result as any).bio).toBe('hello');
    });
  });

  describe('paginate', () => {
    it('defaults the public listing to active, non-banned users', async () => {
      paginationService.paginate.mockResolvedValue({
        edges: [],
        pageInfo: {},
      });

      await service.paginate({} as any);

      expect(queryService.prepareQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        expect.objectContaining({ isActive: true, isBanned: false }),
        expect.anything(),
      );
    });

    it('respects an explicit isActive/isBanned filter override', async () => {
      paginationService.paginate.mockResolvedValue({
        edges: [],
        pageInfo: {},
      });

      await service.paginate({
        filter: { isActive: false, isBanned: true },
      } as any);

      expect(queryService.prepareQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        expect.objectContaining({ isActive: false, isBanned: true }),
        expect.anything(),
      );
    });
  });

  describe('prepareQueryBuilder', () => {
    it('adds a free-text search across username/bio', () => {
      service.prepareQueryBuilder({ query: 'ada' } as any);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        $or: [{ username: { $ilike: '%ada%' } }, { bio: { $ilike: '%ada%' } }],
      });
    });

    it('requires a current user to filter by followed', () => {
      expect(() =>
        service.prepareQueryBuilder({ followed: true } as any),
      ).toThrow(UnauthorizedException);
    });

    it('filters by followed users for the current user', () => {
      const currentUser = { id: 7 } as any;
      service.prepareQueryBuilder(
        { followed: true } as any,
        undefined,
        currentUser,
      );

      expect(queryBuilder.select).toHaveBeenCalledWith('*', true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        followershipsAsFollowed: { follower: 7 },
      });
    });
  });

  describe('encryptPassword', () => {
    it('hashes the password with 10 salt rounds', async () => {
      await expect(service.encryptPassword('secret')).resolves.toBe(
        'hashed-password',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    });
  });
});
