import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CreateTagDataInput } from './dto/create-tag.input';
import { DeleteResult } from 'mongodb';

@Injectable()
export class TagService extends PaginationService<Tag, TagDocument> {
  constructor(@InjectModel('Tag') private tagModel: Model<TagDocument>) {
    super(tagModel);
  }

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag | null> {
    return this.tagModel.findById(_id, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<TagDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag | null> {
    return this.tagModel.findOne(filter, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<TagDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Tag[]> {
    return this.tagModel.find(filter, projection, options).lean();
  }

  async create(input: CreateTagDataInput): Promise<Tag> {
    return this.tagModel.create(input);
  }

  async count(filter?: FilterQuery<TagDocument>): Promise<number> {
    return this.tagModel.count(filter);
  }

  async deleteOne(
    filter?: FilterQuery<TagDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.tagModel.deleteOne(filter, options);
  }

  async deleteMany(
    filter?: FilterQuery<TagDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.tagModel.deleteMany(filter, options);
  }
}
