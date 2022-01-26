import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { SearchArgs } from 'src/search/args/search.args';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private queryService: QueryService<Story, StoryDocument>,
  ) {}

  async findById(_id: string): Promise<Story | null> {
    return this.storyModel.findById(_id).lean();
  }

  async findOne(filter?: FilterStoryInput): Promise<Story | null> {
    return this.storyModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async create(
    { data }: CreateStoryInput,
    author: string,
  ): Promise<Story | null> {
    return this.storyModel.create({
      ...data,
      author,
    });
  }

  async paginate(
    {
      filter,
      sort,
      pagination,
    }: StoryConnectionArgs = new StoryConnectionArgs(),
  ): Promise<StoryConnection> {
    return this.queryService.paginate(
      this.storyModel,
      this.queryService.gqlFilterToMongo(filter),
      sort,
      pagination,
    );
  }

  async search({ query, pagination }: SearchArgs): Promise<StoryConnection> {
    return this.queryService.paginate(
      this.storyModel,
      { $text: { $search: query } },
      null,
      pagination,
    );
  }

  async count(filter?: FilterStoryInput): Promise<number> {
    return this.storyModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
