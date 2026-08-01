import { LikeService } from './like.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('LikeService', () => {
  let service: LikeService;
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
    urlService = {
      getForestUrl: jest.fn().mockReturnValue('/forest/1'),
      getStoryUrl: jest.fn().mockReturnValue('/story/1'),
    };

    service = new LikeService(
      repository,
      notificationService,
      queryService,
      stringService,
      urlService,
    );
  });

  const user = { id: 1, username: 'ada' };

  describe('sendLikeNotification', () => {
    it('notifies the comment author for a like on a forest comment', async () => {
      const like = {
        id: 1,
        user,
        comment: {
          id: 2,
          content: 'nice',
          user: { id: 5 },
          forest: { id: 3, founder: { id: 5 } },
        },
      } as any;

      await service.sendLikeNotification(like);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.LIKE_COMMENT_FOREST,
          targetId: 3,
          user: 5,
          actor: 1,
        }),
        true,
      );
    });

    it('notifies the comment author for a like on a story comment', async () => {
      const like = {
        id: 1,
        user,
        comment: {
          id: 2,
          content: 'nice',
          user: { id: 6 },
          story: { id: 4, author: { id: 6 } },
        },
      } as any;

      await service.sendLikeNotification(like);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.LIKE_COMMENT_STORY,
          targetId: 4,
          user: 6,
        }),
        true,
      );
    });

    it('notifies the story author for a like on a root story', async () => {
      const like = {
        id: 1,
        user,
        story: { id: 7, title: 'A tale', author: { id: 8 }, parent: null },
      } as any;

      await service.sendLikeNotification(like);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.LIKE_STORY,
          targetId: 7,
          user: 8,
          content: expect.stringContaining('story'),
        }),
        true,
      );
    });

    it('describes the target as a chapter when the story has a parent', async () => {
      const like = {
        id: 1,
        user,
        story: {
          id: 7,
          title: 'A chapter',
          author: { id: 8 },
          parent: { id: 6 },
        },
      } as any;

      await service.sendLikeNotification(like);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('chapter'),
        }),
        true,
      );
    });

    it('returns null when the like targets neither a comment nor a story', async () => {
      const like = { id: 1, user } as any;

      await expect(service.sendLikeNotification(like)).resolves.toBeNull();
      expect(notificationService.create).not.toHaveBeenCalled();
    });
  });

  describe('like', () => {
    it('persists the like and sends a notification', async () => {
      const data: any = {
        user,
        story: { id: 7, title: 'A tale', author: { id: 8 }, parent: null },
      };

      const like = await service.like(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(like).toBe(data);
      expect(notificationService.create).toHaveBeenCalled();
    });
  });

  describe('dislike', () => {
    it('returns null when there is nothing to unlike', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.dislike({ user: 1, story: 7 } as any),
      ).resolves.toBeNull();
    });

    it('removes the existing like', async () => {
      const like = { id: 1 };
      queryBuilder.getSingleResult.mockResolvedValue(like);
      const entityManager = repository.getEntityManager();

      const result = await service.dislike({ user: 1, story: 7 } as any);

      expect(entityManager.remove).toHaveBeenCalledWith(like);
      expect(result).toBe(like);
    });
  });
});
