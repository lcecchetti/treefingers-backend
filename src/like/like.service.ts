import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';
import { StoryService } from 'src/story/story.service';
import { CommentService } from 'src/comment/comment.service';
import { UserService } from 'src/user/user.service';
import { LikeFilterInput } from './inputs/like-filter.input';
import {
  LikeAuthorInput,
  LikeCommentInput,
  LikeStoryInput,
} from './inputs/like.input';
import { DeleteResultPayload } from 'src/query/payloads/delete-result.payload';

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

  async createOne(
    data: LikeStoryInput | LikeCommentInput | LikeAuthorInput,
  ): Promise<Like> {
    const like = await this.likeModel.create(data);

    if (!like) {
      return null;
    }

    if (like.story) {
      await this.storyService.updateLikesCount(like.story._id, 1);
    } else if (like.comment) {
      await this.commentService.updateLikesCount(like.comment._id, 1);
    } else if (like.author) {
      await this.userService.updateLikesCount(like.author._id, 1);
    }

    return like;
  }

  async count(filter?: LikeFilterInput): Promise<number> {
    return this.likeModel.count(this.queryService.gqlFilterToMongo(filter));
  }

  async deleteOne(filter?: LikeFilterInput): Promise<Like | null> {
    const like = await this.likeModel
      .findOneAndDelete(this.queryService.gqlFilterToMongo(filter))
      .lean();

    if (!like) {
      return null;
    }

    if (like.story) {
      await this.storyService.updateLikesCount(like.story._id, -1);
    } else if (like.comment) {
      await this.commentService.updateLikesCount(like.comment._id, -1);
    } else if (like.author) {
      await this.userService.updateLikesCount(like.author._id, -1);
    }

    return like;
  }

  async deleteMany(filter?: LikeFilterInput): Promise<DeleteResultPayload> {
    return this.likeModel.deleteMany(
      this.queryService.gqlFilterToMongo(filter),
    );
  }
}
