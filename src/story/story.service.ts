import { BadRequestException, Injectable } from '@nestjs/common';
import { Story } from './story.entity';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { QueryService } from 'src/query/query.service';
import { SortStoryInput } from './inputs/sort-story.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepository: EntityRepository<Story>,
    private paginationService: PaginationService<Story>,
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

    return story;
  }

  async paginate(
    {
      filter,
      sort,
      query,
      ...connectionArgs
    }: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort, { query }),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    filter: FilterStoryInput = new FilterStoryInput(),
    sort: SortStoryInput = new SortStoryInput(),
    { query }: { query?: string } = {},
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

    return queryBuilder;
  }
}
