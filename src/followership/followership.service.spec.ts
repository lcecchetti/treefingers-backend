import { FollowershipService } from './followership.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('FollowershipService', () => {
  let service: FollowershipService;
  let repository: any;
  let notificationService: any;
  let queryService: any;
  let urlService: any;
  let queryBuilder: ReturnType<typeof createQueryBuilderMock>;

  beforeEach(() => {
    queryBuilder = createQueryBuilderMock();
    repository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      create: jest.fn((data) => data),
      getEntityManager: jest.fn().mockReturnValue({
        persist: jest.fn().mockReturnThis(),
        flush: jest.fn().mockResolvedValue(undefined),
        remove: jest.fn().mockReturnThis(),
      }),
    };
    notificationService = { create: jest.fn() };
    queryService = {
      prepareQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    urlService = { getUserUrl: jest.fn().mockReturnValue('/user/ada') };

    service = new FollowershipService(
      repository,
      notificationService,
      queryService,
      urlService,
    );
  });

  describe('follow', () => {
    it('persists the followership and notifies the followed user', async () => {
      const data: any = {
        follower: { id: 1, username: 'ada' },
        followed: { id: 2 },
      };

      const followership = await service.follow(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(followership).toBe(data);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.FOLLOW,
          actor: 1,
          targetId: 1,
          user: 2,
        }),
        true,
      );
    });
  });

  describe('unfollow', () => {
    it('returns null when there is no matching followership', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.unfollow({ followed: 2, follower: 1 } as any),
      ).resolves.toBeNull();
    });

    it('removes an existing followership', async () => {
      const followership = { id: 1 };
      queryBuilder.getSingleResult.mockResolvedValue(followership);
      const entityManager = repository.getEntityManager();

      const result = await service.unfollow({
        followed: 2,
        follower: 1,
      } as any);

      expect(entityManager.remove).toHaveBeenCalledWith(followership);
      expect(result).toBe(followership);
    });
  });
});
