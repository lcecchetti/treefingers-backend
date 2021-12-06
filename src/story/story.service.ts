import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { StoriesPaginated } from './stories.paginated';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { CreateStoryInput } from './dto/create-story.input';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    private paginationService: PaginationService,
  ) {}

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story | null> {
    return this.storyModel.findById(_id, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<StoryDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story[]> {
    return this.storyModel.find(filter, projection, options).lean();
  }

  async paginate(connectionInput: ConnectionInput): Promise<StoriesPaginated> {
    return this.paginationService.paginate<Story>(
      this.storyModel,
      connectionInput,
    );
  }

  async create(input: CreateStoryInput): Promise<Story> {
    return this.storyModel.create(input);
  }
}
