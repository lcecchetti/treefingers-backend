import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { QueryService } from 'src/query/query.service';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { StoryConnectionArgs } from './args/story-connection.args';
import { StoryFilterInput } from './inputs/story-filter.input';
import { CreateStoryDataInput } from './inputs/create-story.input';
import { DeleteResultPayload } from 'src/query/payloads/delete-result.payload';
import { UpdateStoryDataInput } from './inputs/update-story.input';
import { StoryConnection } from './dto/story-connection.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private queryService: QueryService<Story, StoryDocument>,
  ) {}

  async findById(_id: string): Promise<Story | null> {
    return this.storyModel.findById(_id).lean();
  }

  async findOne(filter?: StoryFilterInput): Promise<Story | null> {
    return this.storyModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findMany(filter?: StoryFilterInput): Promise<Story[]> {
    return this.storyModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async createOne(data: CreateStoryDataInput): Promise<Story> {
    return this.storyModel.create(data);
  }

  async count(filter?: StoryFilterInput): Promise<number> {
    return this.storyModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteOne(filter?: StoryFilterInput): Promise<Story | null> {
    return this.storyModel
      .findOneAndDelete(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async deleteMany(filter?: StoryFilterInput): Promise<DeleteResultPayload> {
    return this.storyModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async updateOne(
    filter?: StoryFilterInput,
    update?: UpdateStoryDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.storyModel.updateOne(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async updateMany(
    filter?: StoryFilterInput,
    update?: UpdateStoryDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.storyModel.updateMany(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
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
}
