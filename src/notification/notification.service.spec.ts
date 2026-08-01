import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationType } from './enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
    getCount: jest.fn(),
    update: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };
}

describe('NotificationService', () => {
  let service: NotificationService;
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

    service = new NotificationService(
      repository,
      paginationService,
      queryService,
    );
  });

  describe('create', () => {
    it('does not notify a user about their own action', async () => {
      const result = await service.create({
        type: NotificationType.FOLLOW,
        actor: 1,
        user: 1,
      } as any);

      expect(result).toBeNull();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('creates a notification normally when `once` is not requested', async () => {
      const data: any = { type: NotificationType.FOLLOW, actor: 1, user: 2 };

      const result = await service.create(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(result).toBe(data);
    });

    it('skips creating a duplicate when `once` is true and one already exists', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({ id: 99 });

      const result = await service.create(
        { type: NotificationType.FOLLOW, actor: 1, user: 2 } as any,
        true,
      );

      expect(result).toBeNull();
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('creates the notification when `once` is true but none exists yet', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);
      const data: any = { type: NotificationType.FOLLOW, actor: 1, user: 2 };

      const result = await service.create(data, true);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(result).toBe(data);
    });
  });

  describe('read', () => {
    it('throws NotFoundException when the notification does not exist', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(service.read(1, { id: 1 } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when reading someone else’s notification', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({
        id: 1,
        user: { id: 2 },
        read: false,
      });

      await expect(service.read(1, { id: 1 } as any)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('marks the notification as read for its owner', async () => {
      const notification = { id: 1, user: { id: 1 }, read: false };
      queryBuilder.getSingleResult.mockResolvedValue(notification);

      const result = await service.read(1, { id: 1 } as any);

      expect(result.read).toBe(true);
    });
  });

  describe('readAll', () => {
    it('marks all of a user’s notifications as read and returns the affected count', async () => {
      queryBuilder.execute.mockResolvedValue({ affectedRows: 4 });

      await expect(service.readAll(1)).resolves.toBe(4);
      expect(queryBuilder.update).toHaveBeenCalledWith({ read: true });
      expect(queryBuilder.where).toHaveBeenCalledWith({
        user: 1,
        read: false,
      });
    });
  });

  describe('getUnreadCount', () => {
    it('returns 0 when there is no current user', async () => {
      await expect(service.getUnreadCount(undefined)).resolves.toBe(0);
    });

    it('counts unread notifications for the current user', async () => {
      queryBuilder.getCount.mockResolvedValue(3);

      await expect(service.getUnreadCount({ id: 1 } as any)).resolves.toBe(3);
    });
  });

  describe('prepareQueryBuilder', () => {
    it('scopes the filter to the current user when one is given', () => {
      service.prepareQueryBuilder(undefined, undefined, { id: 7 } as any);

      expect(queryService.prepareQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        expect.objectContaining({ user: { eq: 7 } }),
        expect.anything(),
      );
    });
  });

  describe('paginate', () => {
    it('attaches the unread count alongside the paginated result', async () => {
      paginationService.paginate.mockResolvedValue({
        edges: [],
        pageInfo: {},
      });
      queryBuilder.getCount.mockResolvedValue(2);

      const result = await service.paginate(undefined, { id: 1 } as any);

      expect(result.unreadCount).toBe(2);
    });
  });
});
