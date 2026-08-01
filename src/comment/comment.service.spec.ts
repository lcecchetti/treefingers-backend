import { CommentService } from './comment.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
  };
}

describe('CommentService', () => {
  let service: CommentService;
  let repository: any;
  let paginationService: any;
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
      }),
    };
    paginationService = { paginate: jest.fn() };
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

    service = new CommentService(
      repository,
      paginationService,
      queryService,
      notificationService,
      stringService,
      urlService,
    );
  });

  describe('sendSubmitCommentNotification', () => {
    const user = { id: 1, username: 'ada' };

    it('notifies the forest founder for a comment on a forest', async () => {
      const comment = {
        id: 1,
        content: 'nice forest',
        user,
        forest: { id: 2, name: 'Redwoods', founder: { id: 3 } },
      } as any;

      const notification = await service.sendSubmitCommentNotification(comment);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.COMMENT_FOREST,
          actor: 1,
          targetId: 2,
          user: 3,
        }),
      );
      expect(notification).toBe(
        notificationService.create.mock.results[0].value,
      );
    });

    it('notifies the story author for a comment on a story', async () => {
      const comment = {
        id: 1,
        content: 'nice story',
        user,
        forest: undefined,
        story: { id: 5, title: 'A tale', author: { id: 4 } },
      } as any;

      await service.sendSubmitCommentNotification(comment);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.COMMENT_STORY,
          actor: 1,
          targetId: 5,
          user: 4,
        }),
      );
    });

    it('returns null when the comment targets neither a forest nor a story', async () => {
      const comment = { id: 1, content: 'x', user } as any;

      await expect(
        service.sendSubmitCommentNotification(comment),
      ).resolves.toBeNull();
      expect(notificationService.create).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('persists the comment and sends a notification', async () => {
      const data: any = {
        content: 'hi',
        user: { id: 1, username: 'ada' },
        forest: { id: 2, name: 'Redwoods', founder: { id: 3 } },
      };

      const comment = await service.create(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(comment).toBe(data);
      expect(notificationService.create).toHaveBeenCalled();
    });
  });

  describe('findOne / findMany / findById', () => {
    it('findById filters by id equality', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({ id: 3 });

      await service.findById(3);

      expect(queryService.prepareQueryBuilder).toHaveBeenCalledWith(
        queryBuilder,
        { id: { eq: 3 } },
        expect.anything(),
      );
    });
  });
});
