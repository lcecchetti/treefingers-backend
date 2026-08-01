import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ForestService } from './forest.service';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('ForestService', () => {
  let service: ForestService;
  let repository: any;
  let paginationService: any;
  let queryService: any;
  let queryBuilder: ReturnType<typeof createQueryBuilderMock>;

  beforeEach(() => {
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

    service = new ForestService(repository, paginationService, queryService);
  });

  describe('create', () => {
    it('rejects a duplicate forest name', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({ id: 1 });

      await expect(
        service.create({ name: 'Redwoods' } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('persists a new forest when the name is unique', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      const forest = await service.create({ name: 'Redwoods' } as any);

      expect(repository.create).toHaveBeenCalledWith({ name: 'Redwoods' });
      expect(forest).toEqual({ name: 'Redwoods' });
    });
  });

  describe('isEditable', () => {
    it('is editable by its founder', () => {
      const forest = { founder: { id: 1 } } as any;
      expect(service.isEditable(forest, { id: 1 } as any)).toBe(true);
    });

    it('is not editable by anyone else', () => {
      const forest = { founder: { id: 1 } } as any;
      expect(service.isEditable(forest, { id: 2 } as any)).toBe(false);
    });

    it('is not editable when there is no current user', () => {
      const forest = { founder: { id: 1 } } as any;
      expect(service.isEditable(forest, undefined as any)).toBeFalsy();
    });
  });

  describe('edit', () => {
    it('throws NotFoundException when the forest does not exist', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.edit(1, { about: 'hi' } as any, { id: 1 } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when the current user is not the founder', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({
        id: 1,
        founder: { id: 2 },
      });

      await expect(
        service.edit(1, { about: 'hi' } as any, { id: 1 } as any),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('applies the edit when the current user is the founder', async () => {
      const forest = { id: 1, founder: { id: 1 }, about: 'old' };
      queryBuilder.getSingleResult.mockResolvedValue(forest);

      const result = await service.edit(
        1,
        { about: 'new' } as any,
        { id: 1 } as any,
      );

      expect(result.about).toBe('new');
    });
  });

  describe('prepareQueryBuilder', () => {
    it('adds a free-text search across name/about', () => {
      service.prepareQueryBuilder({ query: 'redwood' } as any);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        $or: [
          { name: { $ilike: '%redwood%' } },
          { about: { $ilike: '%redwood%' } },
        ],
      });
    });

    it('requires a current user to filter by joined forests', () => {
      expect(() =>
        service.prepareQueryBuilder({ joined: true } as any),
      ).toThrow(UnauthorizedException);
    });

    it('filters by the current user membership when joined is requested', () => {
      const currentUser = { id: 9 } as any;
      service.prepareQueryBuilder(
        { joined: true } as any,
        undefined,
        currentUser,
      );

      expect(queryBuilder.select).toHaveBeenCalledWith('*', true);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        memberships: { member: 9 },
      });
    });
  });
});
