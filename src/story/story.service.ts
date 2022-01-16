import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { StoryConnectionArgs } from './args/story-connection.args';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { StoryConnection } from './dto/story-connection.dto';
import { FilterStoryInput } from './inputs/filter-story.input';

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

  async createOne(data: CreateStoryDataInput): Promise<Story> {
    return this.storyModel.create(data);
  }

  async count(filter?: FilterStoryInput): Promise<number> {
    return this.storyModel.count(this.queryService.gqlFilterToMongo(filter));
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
}
