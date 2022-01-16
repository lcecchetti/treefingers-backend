import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { QueryService } from 'src/query/query.service';
import { Model } from 'mongoose';
import { TagConnectionArgs } from './args/tag-connection.args';
import { CreateTagDataInput } from './inputs/create-tag.input';
import { TagConnection } from './dto/tag-connection.dto';
import { FilterTagInput } from './inputs/filter-tag.input';

@Injectable()
export class TagService {
  constructor(
    @InjectModel('Tag') private tagModel: Model<TagDocument>,
    private queryService: QueryService<Tag, TagDocument>,
  ) {}

  async findById(_id: string): Promise<Tag | null> {
    return this.tagModel.findById(_id).lean();
  }

  async findOne(filter?: FilterTagInput): Promise<Tag | null> {
    return this.tagModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findMany(filter?: FilterTagInput): Promise<Tag[]> {
    return this.tagModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async createOne(data: CreateTagDataInput): Promise<Tag> {
    return this.tagModel.create(data);
  }

  async count(filter?: FilterTagInput): Promise<number> {
    return this.tagModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async paginate(args: TagConnectionArgs): Promise<TagConnection> {
    return this.queryService.paginate(this.tagModel, args);
  }
}
