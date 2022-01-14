import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';
import { StoryService } from 'src/story/story.service';
import { CommentService } from 'src/comment/comment.service';
import { UserService } from 'src/user/user.service';
import { LikeFilterInput } from './inputs/like-filter.input';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    private queryService: QueryService<Like, LikeDocument>,
    private storyService: StoryService,
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: LikeFilterInput): Promise<Like | null> {
    return this.likeModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async likeStory(story: string, user: string): Promise<Like> {
    const like = await this.likeModel.create({ story, user });

    if (!like) {
      return null;
    }

    await this.storyService.updateLikesCount(story, 1);

    return like;
  }

  async likeComment(comment: string, user: string): Promise<Like> {
    const like = await this.likeModel.create({ comment, user });

    if (!like) {
      return null;
    }

    await this.commentService.updateLikesCount(comment, 1);

    return like;
  }

  async likeAuthor(author: string, user: string): Promise<Like> {
    const like = await this.likeModel.create({ author, user });

    if (!like) {
      return null;
    }

    await this.userService.updateLikesCount(author, 1);

    return like;
  }

  async count(filter?: LikeFilterInput): Promise<number> {
    return this.likeModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async dislikeStory(story: string, user: string): Promise<Like | null> {
    const like = await this.likeModel.findOneAndDelete({ story, user }).lean();

    if (!like) {
      return null;
    }

    await this.storyService.updateLikesCount(like.story._id, -1);

    return like;
  }

  async dislikeComment(comment: string, user: string): Promise<Like | null> {
    const like = await this.likeModel
      .findOneAndDelete({ comment, user })
      .lean();

    if (!like) {
      return null;
    }

    await this.commentService.updateLikesCount(like.comment._id, -1);

    return like;
  }

  async dislikeAuthor(author: string, user: string): Promise<Like | null> {
    const like = await this.likeModel.findOneAndDelete({ author, user }).lean();

    if (!like) {
      return null;
    }

    await this.userService.updateLikesCount(like.author._id, -1);

    return like;
  }
}
