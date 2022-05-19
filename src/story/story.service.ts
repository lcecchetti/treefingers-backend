import { BadRequestException, Injectable } from '@nestjs/common';
import { Story } from './story.entity';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, TreeRepository } from 'typeorm';
import { QueryService } from 'src/query/query.service';
import { SortStoryInput } from './inputs/sort-story.input';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story) private storyRepository: TreeRepository<Story>,
    private paginationService: PaginationService<Story>,
    private queryService: QueryService<Story>,
  ) {}

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterStoryInput): Promise<Story[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async findById(id: number): Promise<Story | null> {
    return this.findOne({ id: { eq: id } });
  }

  async create(data: CreateStoryDataInput): Promise<Story | null> {
    if (!data.forestId && !data.parentId) {
      throw new BadRequestException('Forest is required on root stories');
    }

    data.level = 0;
    if (data.parentId) {
      const parent = await this.findById(data.parentId);
      data.rootId = parent.rootId || parent.id;
      data.forestId = undefined;
      data.level = parent.level + 1;
    }

    return this.storyRepository.save(data);
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    return this.paginationService.paginate(
      this.prepareQueryBuilder(filter, sort),
      sort,
      connectionArgs,
    );
  }

  prepareQueryBuilder(
    { query, ...filter }: FilterStoryInput = new FilterStoryInput(),
    sort: SortStoryInput = new SortStoryInput(),
  ) {
    const queryBuilder = this.storyRepository.createQueryBuilder();

    // add query conditon
    if (query) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`"title" ilike :query_title`, {
            ['query_title']: `%${query}%`,
          });
          qb.orWhere(`"content" ilike :query_content`, {
            ['query_content']: `%${query}%`,
          });
        }),
      );
    }

    return this.queryService.prepareQueryBuilder(queryBuilder, filter, sort);
  }
}
