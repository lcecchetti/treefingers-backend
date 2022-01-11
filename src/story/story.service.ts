import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './story.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';

@Injectable()
export class StoryService extends QueryService<Story, StoryDocument> {
  constructor(@InjectModel('Story') model: Model<StoryDocument>) {
    super(model);
  }
}
