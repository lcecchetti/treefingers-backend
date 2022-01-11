import { Model, UpdateWriteOpResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { QueryService } from 'src/query/query.service';
import { CommentFilterInput } from './dto/comment-filter.input';
import { CreateCommentDataInput } from './dto/create-comment.input';
import { DeleteResult } from 'mongodb';
import { UpdateCommentDataInput } from './dto/update-comment.input';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment.connection';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private queryService: QueryService<Comment, CommentDocument>,
  ) {}

  async findById(_id: string): Promise<Comment | null> {
    return this.commentModel.findById(_id).lean();
  }

  async findOne(filter?: CommentFilterInput): Promise<Comment | null> {
    return this.commentModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findAll(filter?: CommentFilterInput): Promise<Comment[]> {
    return this.commentModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async create(data: CreateCommentDataInput): Promise<Comment> {
    return this.commentModel.create(data);
  }

  async count(filter?: CommentFilterInput): Promise<number> {
    return this.commentModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteOne(filter?: CommentFilterInput): Promise<DeleteResult> {
    return this.commentModel.deleteOne(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async deleteMany(filter?: CommentFilterInput): Promise<DeleteResult> {
    return this.commentModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async updateOne(
    filter?: CommentFilterInput,
    update?: UpdateCommentDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.commentModel.updateOne(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async updateMany(
    filter?: CommentFilterInput,
    update?: UpdateCommentDataInput,
  ): Promise<UpdateWriteOpResult> {
    return this.commentModel.updateMany(
      this.queryService.gqlFilterToMongo(filter),
      update,
    );
  }

  async paginate(args: CommentConnectionArgs): Promise<CommentConnection> {
    return this.queryService.paginate(this.commentModel, args);
  }
}
