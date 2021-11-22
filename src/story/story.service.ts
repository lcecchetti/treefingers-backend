import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { PaginationService } from '../pagination/pagination.service';
import { ConnectionInput } from '../pagination/pagination.dto';
import { StoryConnection } from './story.connection';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    private paginationService: PaginationService,
  ) {}

  async findAll(): Promise<Story[]> {
    return this.storyModel.find().exec();
  }

  async paginate(connectionInput: ConnectionInput): Promise<StoryConnection> {
    return this.paginationService.paginate<Story>(
      this.storyModel,
      connectionInput,
    );
  }
}
