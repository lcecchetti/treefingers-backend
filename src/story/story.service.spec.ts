import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { NotificationType } from '../notification/enum/notification-type.enum';

function createQueryBuilderMock() {
  return {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getSingleResult: jest.fn(),
    getResult: jest.fn(),
    getCount: jest.fn(),
  };
}

describe('StoryService', () => {
  let service: StoryService;
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
    urlService = { getStoryUrl: jest.fn().mockReturnValue('/story/1') };

    service = new StoryService(
      repository,
      paginationService,
      notificationService,
      queryService,
      stringService,
      urlService,
    );
  });

  describe('create', () => {
    it('rejects a root story with no forest', async () => {
      await expect(service.create({} as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects continuing a parent that does not exist', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.create({ parent: 99 } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('derives forest/path/root from the parent when continuing a story', async () => {
      // `parent` stands in for what MikroORM would resolve `data.parent`
      // to once loaded; the service never reassigns `data.parent` itself,
      // so we hand it the fully-shaped entity `findById` will return.
      const parent = { id: 5, path: [1, 2], root: null, author: { id: 2 } };
      queryBuilder.getSingleResult.mockResolvedValue(parent);
      // notification building is covered in its own describe block below and
      // assumes fully-hydrated relations; stub it here to isolate this test
      // to the forest/path/root derivation logic.
      jest
        .spyOn(service, 'sendCreateStoryNotifications')
        .mockResolvedValue(undefined);

      const data: any = {
        parent,
        forest: 3,
        title: 't',
        content: 'c',
        author: { id: 1, username: 'ada' },
      };
      const story = await service.create(data);

      expect(story.forest).toBeUndefined();
      expect(story.path).toEqual([1, 2, 5]);
      expect(story.root).toBe(5);
    });

    it('uses the parent chapter root when the parent already has one', async () => {
      const parent = {
        id: 5,
        path: [1],
        root: { id: 1, author: { id: 2 } },
        author: { id: 2 },
      };
      queryBuilder.getSingleResult.mockResolvedValue(parent);
      jest
        .spyOn(service, 'sendCreateStoryNotifications')
        .mockResolvedValue(undefined);

      const story = await service.create({
        parent,
        author: { id: 1, username: 'ada' },
      } as any);

      expect(story.root).toBe(1);
    });

    it('persists a root story with a forest and sends notifications', async () => {
      const data: any = {
        forest: { id: 9, name: 'Redwoods', founder: { id: 6 } },
        title: 't',
        content: 'c',
        author: { id: 1, username: 'ada' },
      };
      const story = await service.create(data);

      expect(repository.create).toHaveBeenCalledWith(data);
      expect(story).toBe(data);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: NotificationType.FOREST_CONTINUE }),
      );
    });
  });

  describe('sendCreateStoryNotifications', () => {
    const author = { id: 1, username: 'ada' };

    it('notifies the parent author when a chapter continues their story', async () => {
      const story = {
        title: 'chapter',
        author,
        parent: { id: 2, title: 'root', author: { id: 2 } },
        root: null,
      } as any;

      await service.sendCreateStoryNotifications(story);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.CHAPTER_CONTINUE,
          actor: 1,
          user: 2,
          targetId: 2,
        }),
      );
    });

    it('also notifies the root author when it differs from the direct parent author', async () => {
      const story = {
        title: 'chapter 3',
        author,
        parent: { id: 3, title: 'chapter 2', author: { id: 2 } },
        root: { id: 1, title: 'root', author: { id: 5 } },
      } as any;

      await service.sendCreateStoryNotifications(story);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.STORY_CONTINUE,
          user: 5,
          targetId: 1,
        }),
      );
    });

    it('does not double-notify the root author when they are also the direct parent author', async () => {
      const story = {
        title: 'chapter 2',
        author,
        parent: { id: 1, title: 'root', author: { id: 5 } },
        root: { id: 1, title: 'root', author: { id: 5 } },
      } as any;

      await service.sendCreateStoryNotifications(story);

      const types = notificationService.create.mock.calls.map(
        ([payload]: any) => payload.type,
      );
      expect(types).not.toContain(NotificationType.STORY_CONTINUE);
    });

    it('notifies the forest founder for a root story planted in a forest', async () => {
      const story = {
        title: 'root',
        author,
        forest: { id: 9, name: 'Redwoods', founder: { id: 6 } },
      } as any;

      await service.sendCreateStoryNotifications(story);

      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.FOREST_CONTINUE,
          user: 6,
          targetId: 9,
        }),
      );
    });
  });

  describe('isEditable', () => {
    it('is false with no current user', async () => {
      const story = { author: { id: 1 } } as any;
      await expect(service.isEditable(story, undefined as any)).resolves.toBe(
        false,
      );
    });

    it('is false when the current user is not the author', async () => {
      const story = { author: { id: 1 } } as any;
      await expect(service.isEditable(story, { id: 2 } as any)).resolves.toBe(
        false,
      );
    });

    it('is true for the author when no one else has continued the story', async () => {
      const story = { id: 10, author: { id: 1 } } as any;
      queryBuilder.getCount.mockResolvedValue(0);

      await expect(service.isEditable(story, { id: 1 } as any)).resolves.toBe(
        true,
      );
    });

    it('is false for the author once someone else has continued the story', async () => {
      const story = { id: 10, author: { id: 1 } } as any;
      queryBuilder.getCount.mockResolvedValue(1);

      await expect(service.isEditable(story, { id: 1 } as any)).resolves.toBe(
        false,
      );
    });
  });

  describe('edit', () => {
    it('throws NotFoundException when the story does not exist', async () => {
      queryBuilder.getSingleResult.mockResolvedValue(null);

      await expect(
        service.edit(1, { title: 'x' } as any, { id: 1 } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when the story is not editable', async () => {
      queryBuilder.getSingleResult.mockResolvedValue({
        id: 1,
        author: { id: 2 },
      });

      await expect(
        service.edit(1, { title: 'x' } as any, { id: 1 } as any),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('applies the edit when the story is editable', async () => {
      const story = { id: 1, author: { id: 1 }, title: 'old' };
      queryBuilder.getSingleResult.mockResolvedValue(story);
      queryBuilder.getCount.mockResolvedValue(0);

      const result = await service.edit(
        1,
        { title: 'new' } as any,
        { id: 1 } as any,
      );

      expect(result.title).toBe('new');
    });
  });

  describe('prepareQueryBuilder', () => {
    it('adds a free-text search across title/content/tags', () => {
      service.prepareQueryBuilder({ query: 'forest' } as any);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        $or: [
          { title: { $ilike: '%forest%' } },
          { content: { $ilike: '%forest%' } },
          { 'tags::text': { $ilike: '%forest%' } },
        ],
      });
    });

    it('requires a current user to filter by liked stories', () => {
      expect(() => service.prepareQueryBuilder({ liked: true } as any)).toThrow(
        UnauthorizedException,
      );
    });

    it('filters by stories liked by the current user', () => {
      const currentUser = { id: 4 } as any;
      service.prepareQueryBuilder(
        { liked: true } as any,
        undefined,
        currentUser,
      );

      expect(queryBuilder.select).toHaveBeenCalledWith('*');
      expect(queryBuilder.andWhere).toHaveBeenCalledWith({
        likes: { user: 4 },
      });
    });
  });
});
