import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';

@Injectable()
export class TagService extends QueryService<Tag, TagDocument> {
  constructor(@InjectModel('Tag') protected model: Model<TagDocument>) {
    super(model);
  }
}
