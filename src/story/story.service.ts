import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { StoryConnection } from './story.connection';
import { ConnectionInput } from 'src/pagination/dto/connection.input';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    filter?: FilterQuery<StoryDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Story[]> {
    return this.storyModel.find(filter, projection, options).lean();
  }

  async paginate(connectionInput: ConnectionInput): Promise<StoryConnection> {
    return this.paginationService.paginate<Story>(
      this.storyModel,
      connectionInput,
    );
  }
}
