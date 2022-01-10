import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.entity';
import { CreateCommentDataInput } from './dto/create-comment.input';
import { DeleteResult } from 'mongodb';
import { QueryService } from 'src/query/query.service';

@Injectable()
export class CommentService extends QueryService<Comment, CommentDocument> {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }

  async findById(
    _id: string,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Comment | null> {
    return this.commentModel.findById(_id, projection, options).lean();
  }

  async findOne(
    filter?: FilterQuery<CommentDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Comment | null> {
    return this.commentModel.findOne(filter, projection, options).lean();
  }

  async findAll(
    filter?: FilterQuery<CommentDocument>,
    projection?: any | null,
    options?: QueryOptions,
  ): Promise<Comment[]> {
    return this.commentModel.find(filter, projection, options).lean();
  }

  async create(data: CreateCommentDataInput): Promise<Comment> {
    return this.commentModel.create(data);
  }

  async count(filter?: FilterQuery<CommentDocument>): Promise<number> {
    return this.commentModel.count(filter);
  }

  async deleteOne(
    filter?: FilterQuery<CommentDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.commentModel.deleteOne(filter, options);
  }

  async deleteMany(
    filter?: FilterQuery<CommentDocument>,
    options?: QueryOptions,
  ): Promise<DeleteResult> {
    return this.commentModel.deleteMany(filter, options);
  }

  async updateOne(
    filter?: FilterQuery<CommentDocument>,
    update?: UpdateQuery<CommentDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.commentModel.updateOne(filter, update, options);
  }

  async updateMany(
    filter?: FilterQuery<CommentDocument>,
    update?: UpdateQuery<CommentDocument>,
    options?: QueryOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.commentModel.updateMany(filter, update, options);
  }
}
