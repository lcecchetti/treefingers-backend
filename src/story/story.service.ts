import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';
import { UserService } from 'src/user/user.service';
import { SearchArgs } from 'src/search/args/search.args';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private queryService: QueryService<Story, StoryDocument>,
    private userService: UserService,
    private tagService: TagService,
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
    const tags = await this.tagService.prepareStoryTags(data.tags);

    const story = await this.storyModel.create({
      ...data,
      author,
      tags,
    });

    if (!story) {
      return null;
    }

    await this.userService.updateStoryCount(author, 1);
    await this.tagService.updateStoriesCount(data.tags, 1);

    return story;
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

  async updateLikesCount(story: string, amount: number) {
    return this.storyModel.updateOne(
      { _id: story },
      { $inc: { likesCount: amount } },
    );
  }

  async updateCommentsCount(story: string, amount: number) {
    return this.storyModel.updateOne(
      { _id: story },
      { $inc: { commentsCount: amount } },
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
}
