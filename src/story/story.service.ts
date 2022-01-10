import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { CreateStoryDataInput } from './dto/create-story.input';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { StringService } from 'src/utils/services/string.service';
import { DeleteResult } from 'mongodb';

@Injectable()
export class StoryService extends PaginationService<Story, StoryDocument> {
  constructor(
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    private stringService: StringService,
  ) {
    super(storyModel);
  }

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story | null> {
    return this.storyModel.findById(_id, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<StoryDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story | null> {
    return this.storyModel.findOne(filter, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<StoryDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story[]> {
    return this.storyModel.find(filter, projection, options).lean();
  }

  async create(input: CreateStoryDataInput): Promise<Story> {
    input.excerpt = this.stringService.createExcerpt(input.content);
    return this.storyModel.create(input);
  }

  async count(filter?: FilterQuery<StoryDocument>): Promise<number> {
    return this.storyModel.count(filter);
  }

  async deleteOne(
    filter?: FilterQuery<StoryDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.storyModel.deleteOne(filter, options);
  }

  async deleteMany(
    filter?: FilterQuery<StoryDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.storyModel.deleteMany(filter, options);
  }
}
