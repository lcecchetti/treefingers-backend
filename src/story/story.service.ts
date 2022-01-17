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

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private queryService: QueryService<Story, StoryDocument>,
    private userService: UserService,
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
    const story = this.storyModel.create({
      ...data,
      author,
    });

    if (!story) {
      return null;
    }

    this.userService.updateStoryCount(author, 1);

    return story;
  }

  async paginate(args: StoryConnectionArgs): Promise<StoryConnection> {
    return this.queryService.paginate(this.storyModel, args);
  }

  async updateLikesCount(story: string, amount: number) {
    return await this.storyModel.updateOne(
      { _id: story },
      { $inc: { likesCount: amount } },
    );
  }

  async updateCommentsCount(story: string, amount: number) {
    return await this.storyModel.updateOne(
      { _id: story },
      { $inc: { commentsCount: amount } },
    );
  }

  async search({ query, pagination }: SearchArgs): Promise<StoryConnection> {
    return await this.queryService.paginate(
      this.storyModel,
      { $text: { $search: query } },
      null,
      pagination,
    );
  }
}
