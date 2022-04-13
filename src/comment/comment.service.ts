import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';
import { CommentDataInput } from './inputs/comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private paginationService: PaginationService<Comment, CommentDocument>,
    private filterService: FilterService<CommentDocument>,
  ) {}

  async findById(_id: string): Promise<Comment | null> {
    return this.commentModel.findById(_id).lean();
  }

  async findOne(
    filter: FilterCommentInput = new FilterCommentInput(),
  ): Promise<Comment | null> {
    return this.commentModel.findOne(this.prepareFilter(filter)).lean();
  }

  async create(data: CommentDataInput): Promise<Comment> {
    return this.commentModel.create(data);
  }

  async paginate(
    {
      filter,
      sort,
      ...connectionArgs
    }: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.paginationService.paginate(
      this.commentModel,
      this.prepareFilter(filter),
      sort,
      connectionArgs,
    );
  }

  async count(filter?: FilterCommentInput): Promise<number> {
    return this.commentModel.count(this.filterService.prepareFilter(filter));
  }

  prepareFilter(filter: FilterCommentInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
