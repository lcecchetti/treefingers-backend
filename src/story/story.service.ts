import { BadRequestException, Injectable } from '@nestjs/common';
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
import { NotificationWhat } from '../notification/enum/notification-what.enum';
import { NotificationReferenceType } from '../notification/enum/notification-reference-type.enum';
import { ForestService } from '../forest/forest.service';
import { Notification } from '../notification/notification.entity';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepository: EntityRepository<Story>,
    private paginationService: PaginationService<Story>,
    private forestService: ForestService,
    private notificationService: NotificationService,
    private queryService: QueryService<Story>,
  ) {}

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterStoryInput): Promise<Story[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Story | null> {
    return this.findOne({ id: { eq: id } });
  }

  async sendCreateStoryNotifications(story: Story) {
    if (story.root) {
      const root = await this.findById(story.root.id);
      await this.notificationService.create({
        what: NotificationWhat.STORY_CONTINUE,
        who: story.author.id,
        referenceId: story.id,
        referenceType: NotificationReferenceType.STORY,
        sourceId: story.id,
        sourceType: NotificationSourceType.STORY,
        user: root.author.id,
      });
    }

    if (story.parent && story.parent.id !== story.root.id) {
      const parent = await this.findById(story.parent.id);
      await this.notificationService.create({
        what: NotificationWhat.CHAPTER_CONTINUE,
        who: story.author.id,
        referenceId: story.id,
        referenceType: NotificationReferenceType.STORY,
        sourceId: story.id,
        sourceType: NotificationSourceType.STORY,
        user: parent.author.id,
      });
    }

    if (story.forest) {
      const forest = await this.forestService.findById(story.forest.id);
      await this.notificationService.create({
        what: NotificationWhat.STORY_CREATE,
        who: forest.founder.id,
        referenceId: story.id,
        referenceType: NotificationReferenceType.STORY,
        sourceId: story.id,
        sourceType: NotificationSourceType.STORY,
        user: forest.founder.id,
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
      queryBuilder.andWhere({
        likes: { user: currentUser.id },
      });
    }

    return queryBuilder;
  }
}
