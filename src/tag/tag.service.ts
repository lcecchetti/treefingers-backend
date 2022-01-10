import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './tag.entity';
import { CreateTagDataInput } from './dto/create-tag.input';
import { DeleteResult } from 'mongodb';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class TagService extends QueryService<Tag, TagDocument> {
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

  async updateOne(
    filter?: FilterQuery<TagDocument>,
    update?: UpdateQuery<TagDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.tagModel.updateOne(filter, update, options);
  }

  async updateMany(
    filter?: FilterQuery<TagDocument>,
    update?: UpdateQuery<TagDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.tagModel.updateMany(filter, update, options);
  }
}
