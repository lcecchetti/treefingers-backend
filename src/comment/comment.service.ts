import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { CommentStoryInput } from './inputs/comment-story.input';
import { CommentForestInput } from './inputs/comment-forest.input';
import { PaginationService } from 'src/pagination/pagination.service';
import { FilterService } from 'src/filter/filter.service';

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

  async commentStory(
    { story, data }: CommentStoryInput,
    user: string,
  ): Promise<Comment> {
    return this.commentModel.create({
      ...data,
      story,
      user,
    });
  }

  async commentForest(
    { forest, data }: CommentForestInput,
    user: string,
  ): Promise<Comment> {
    return this.commentModel.create({
      ...data,
      forest,
      user,
    });
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
