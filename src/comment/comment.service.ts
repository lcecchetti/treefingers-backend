import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, Comment } from './comment.entity';
import { QueryService } from 'src/query/query.service';
import { CommentConnectionArgs } from './args/comment-connection.args';
import { CommentConnection } from './dto/comment-connection.dto';
import { FilterCommentInput } from './inputs/filter-comment.input';
import { CommentStoryInput } from './inputs/comment-story.input';
import { StoryService } from 'src/story/story.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private queryService: QueryService<Comment, CommentDocument>,
    private storyService: StoryService,
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
    const comment = await this.commentModel.create({
      ...data,
      story,
      user,
    });

    if (!comment) {
      return null;
    }

    this.storyService.updateCommentsCount(story, 1);

    return comment;
  }

  async count(filter?: FilterCommentInput): Promise<number> {
    return this.commentModel.count(this.queryService.gqlFilterToMongo(filter));
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
