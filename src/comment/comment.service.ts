import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.entity';
import { PaginationService } from 'src/pagination/pagination.service';
import { CommentsPaginated } from './comments.paginated';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private paginationService: PaginationService,
  ) {}

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

  async paginate(connectionInput: ConnectionInput): Promise<CommentsPaginated> {
    return this.paginationService.paginate<Comment>(
      this.commentModel,
      connectionInput,
    );
  }

  async create(input: CreateCommentInput): Promise<Comment> {
    return this.commentModel.create(input);
  }
}
