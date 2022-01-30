import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { QueryService } from 'src/query/query.service';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { CommentStoryInput } from './inputs/comment-story.input';
import { CommentForestInput } from './inputs/comment-forest.input';

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
      pagination,
    }: CommentConnectionArgs = new CommentConnectionArgs(),
  ): Promise<CommentConnection> {
    return this.queryService.paginate(
      this.commentModel,
      this.queryService.gqlFilterToMongo(filter),
      sort,
      pagination,
    );
  }

  async count(filter?: FilterCommentInput): Promise<number> {
    return this.commentModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
