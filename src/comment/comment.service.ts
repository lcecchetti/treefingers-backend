import { Model, UpdateWriteOpResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { QueryService } from 'src/query/query.service';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CreateCommentDataInput } from './inputs/create-comment.input';
import { UpdateCommentDataInput } from './inputs/update-comment.input';
import { CommentConnection } from './dto/comment-connection.dto';
import { DeleteResultPayload } from 'src/query/payloads/delete-result.payload';
import { FilterCommentInput } from './inputs/filter-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private queryService: QueryService<Comment, CommentDocument>,
  ) {}

  async findById(_id: string): Promise<Comment | null> {
    return this.commentModel.findById(_id).lean();
  }

  async findOne(filter?: FilterCommentInput): Promise<Comment | null> {
    return this.commentModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async findMany(filter?: FilterCommentInput): Promise<Comment[]> {
    return this.commentModel
      .find(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async createOne(data: CreateCommentDataInput): Promise<Comment> {
    return this.commentModel.create(data);
  }

  async count(filter?: FilterCommentInput): Promise<number> {
    return this.commentModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteOne(filter?: FilterCommentInput): Promise<Comment | null> {
    return this.commentModel
      .findOneAndDelete(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async deleteMany(filter?: FilterCommentInput): Promise<DeleteResultPayload> {
    return this.commentModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }

  async updateOne(
    filter?: FilterCommentInput,
    update?: UpdateCommentDataInput,
  ): Promise<Comment | null> {
    return this.commentModel
      .findOneAndUpdate(this.queryService.gqlFilterToMongo(filter), update)
      .lean();
  }

  async updateMany(
    filter?: FilterCommentInput,
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

  async updateLikesCount(comment: string, amount: number) {
    return this.commentModel.updateOne(
      { _id: comment },
      { $inc: { likesCount: amount } },
    );
  }
}
