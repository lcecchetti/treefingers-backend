import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Story } from './story.entity';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { PaginationService } from '../pagination/pagination.service';
import { QueryService } from '../query/query.service';
import { SortStoryInput } from './inputs/sort-story.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CurrentUser } from '../auth/dto/current-user.dto';
import { NotificationService } from '../notification/notification.service';
import { StringService } from '../common/services/string.service';
import { wrap } from '@mikro-orm/core';
import { NotificationType } from '../notification/enum/notification-type.enum';
import { UrlService } from '../common/services/url.service';
import { EditStoryDataInput } from './inputs/edit-story.input';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepository: EntityRepository<Story>,
    private paginationService: PaginationService<Story>,
    private notificationService: NotificationService,
    private queryService: QueryService<Story>,
    private stringService: StringService,
    private urlService: UrlService,
  ) {}

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterStoryInput): Promise<Story[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async count(filter?: FilterStoryInput): Promise<number> {
    return this.prepareQueryBuilder(filter).getCount();
  }

  async findById(id: number): Promise<Story | null> {
    return this.findOne({ id: { eq: id } });
  }

  async sendCreateStoryNotifications(story: Story) {
    await wrap(story.author).init();
    if (story.root) {
      await wrap(story.root).init();
      const rootExcerpt = this.stringService.createExcerpt(
        story.root.title,
        20,
      );
      await this.notificationService.create({
        type: NotificationType.STORY_CONTINUE,
        actor: story.author.id,
        targetId: story.root.id,
        sourceId: story.id,
        user: story.root.author.id,
        link: this.urlService.getStoryUrl(story),
        content: `${story.author.username} continued your story "${rootExcerpt}"`,
      });
    }

    if (story.parent && story.parent.id !== story.root.id) {
      await wrap(story.parent).init();
      const parentExcerpt = this.stringService.createExcerpt(
        story.parent.title,
        20,
      );
      await this.notificationService.create({
        type: NotificationType.CHAPTER_CONTINUE,
        actor: story.author.id,
        targetId: story.parent.id,
        sourceId: story.id,
        user: story.parent.author.id,
        link: this.urlService.getStoryUrl(story),
        content: `${story.author.username} continued your chapter "${parentExcerpt}"`,
      });
    }

    if (story.forest) {
      await wrap(story.forest).init();
      const storyExcerpt = this.stringService.createExcerpt(story.title, 20);
      const forestExcerpt = this.stringService.createExcerpt(
        story.forest.name,
        20,
      );
      await this.notificationService.create({
        type: NotificationType.FOREST_CONTINUE,
        actor: story.author.id,
        targetId: story.forest.id,
        sourceId: story.id,
        user: story.forest.founder.id,
        link: this.urlService.getStoryUrl(story),
        content: `${story.author.username} planted a story "${storyExcerpt}" in your forest "${forestExcerpt}"`,
      });
    }
  }

  async create(data: CreateStoryDataInput): Promise<Story | null> {
    if (!data.forest && !data.parent) {
      throw new BadRequestException('Forest is required on root stories');
    }

    if (data.parent) {
      const parent = await this.findById(data.parent);
      data.forest = undefined;
      data.path = [...parent.path, parent.id];
      data.root = parent.root ? parent.root.id : parent.id;
    }

    const story = await this.storyRepository.create(data);
    await this.storyRepository.persistAndFlush(story);

    await this.sendCreateStoryNotifications(story);

    return story;
  }

  async isEditable(story: Story, currentUser: CurrentUser): Promise<boolean> {
    if (!currentUser || currentUser.id !== story.author.id) {
      return false;
    }

    const outherAuthorChaptersCount = await this.count({
      author: { ne: story.author.id },
      parent: { eq: story.id },
    });

    return !outherAuthorChaptersCount;
  }

  async edit(
    id: number,
    data: EditStoryDataInput,
    currentUser: CurrentUser,
  ): Promise<Story> {
    const story = await this.findById(id);

    if (!story) {
      throw new NotFoundException(
        'The story you are trying to edit does not exist.',
      );
    }

    if (!(await this.isEditable(story, currentUser))) {
      throw new UnauthorizedException(
        'You cannot edit a story which has been continued by others or not yours.',
      );
    }

    wrap(story).assign(data);
    await this.storyRepository.persistAndFlush(story);
    return story;
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: StoryConnectionArgs = new StoryConnectionArgs(),
    currentUser?: CurrentUser,
  ): Promise<StoryConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort, currentUser),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    { query, liked, ...filter }: FilterStoryInput = new FilterStoryInput(),
    sort: SortStoryInput = new SortStoryInput(),
    currentUser?: CurrentUser,
  ) {
    const queryBuilder = this.queryService.prepareQueryBuilder(
      this.storyRepository.createQueryBuilder(),
      filter,
      sort,
    );

    if (query) {
      queryBuilder.andWhere({
        $or: [
          { title: { $ilike: `%${query}%` } },
          { content: { $ilike: `%${query}%` } },
          { 'tags::text': { $ilike: `%${query}%` } },
        ],
      });
    }

    if (liked) {
      queryBuilder.select('*', true).andWhere({
        likes: { user: currentUser.id },
      });
    }

    return queryBuilder;
  }
}
