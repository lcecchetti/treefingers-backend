import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CreateCommentDataInput } from './dto/create-comment.input';

@Injectable()
export class CommentService extends PaginationService<Comment> {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
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
}
