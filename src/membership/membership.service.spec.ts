import { MembershipService } from './membership.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('MembershipService', () => {
  let service: MembershipService;
  let repository: any;
  let notificationService: any;
  let queryService: any;
  let stringService: any;
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
    stringService = {
      createExcerpt: jest.fn((text: string) => `excerpt(${text})`),
    };
    urlService = { getForestUrl: jest.fn().mockReturnValue('/forest/1') };

    service = new MembershipService(
      repository,
      notificationService,
      queryService,
      stringService,
      urlService,
    );
  });

  describe('join', () => {
    it('persists the membership and notifies the forest founder', async () => {
      const data: any = {
        member: { id: 1, username: 'ada' },
        forest: { id: 2, name: 'Redwoods', founder: { id: 3 } },
      };

      const membership = await service.join(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(membership).toBe(data);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.JOIN,
          actor: 1,
          targetId: 2,
          user: 3,
        }),
        true,
      );
    });
  });

  describe('leave', () => {
    it('returns null when there is no matching membership', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.leave({ forest: 2, member: 1 } as any),
      ).resolves.toBeNull();
    });

    it('removes an existing membership', async () => {
      const membership = { id: 1 };
      queryBuilder.getSingleResult.mockResolvedValue(membership);
      const entityManager = repository.getEntityManager();

      const result = await service.leave({ forest: 2, member: 1 } as any);

      expect(entityManager.remove).toHaveBeenCalledWith(membership);
      expect(result).toBe(membership);
    });
  });
});
