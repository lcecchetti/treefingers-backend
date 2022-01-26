import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';
import { FilterLikeInput } from './inputs/filter-like.input';
import { LikeStoryInput } from './inputs/like-story.input';
import { LikeCommentInput } from './inputs/like-comment';
import { LikeAuthorInput } from './inputs/like-author.input';
import { DislikeStoryInput } from './inputs/dislike-story.input';
import { DislikeCommentInput } from './inputs/dislike.comment.input';
import { DislikeAuthorInput } from './inputs/dislike-author.input';
import { DislikeForestInput } from './inputs/dislike-forest.input';
import { LikeForestInput } from './inputs/like-forest.input';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    private queryService: QueryService<Like, LikeDocument>,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.likeModel
      .findOne(this.queryService.gqlFilterToMongo(filter))
      .lean();
  }

  async likeStory({ story }: LikeStoryInput, user: string): Promise<Like> {
    return this.likeModel.create({ story, user });
  }

  async likeComment(
    { comment }: LikeCommentInput,
    user: string,
  ): Promise<Like> {
    return await this.likeModel.create({ comment, user });
  }

  async likeAuthor({ author }: LikeAuthorInput, user: string): Promise<Like> {
    return this.likeModel.create({ author, user });
  }

  async likeForest({ forest }: LikeForestInput, user: string): Promise<Like> {
    return await this.likeModel.create({ forest, user });
  }

  async dislikeStory(
    { story }: DislikeStoryInput,
    user: string,
  ): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ story, user }).lean();
  }

  async dislikeComment(
    { comment }: DislikeCommentInput,
    user: string,
  ): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ comment, user }).lean();
  }

  async dislikeAuthor(
    { author }: DislikeAuthorInput,
    user: string,
  ): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ author, user }).lean();;
  }

  async dislikeForest(
    { forest }: DislikeForestInput,
    user: string,
  ): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ forest, user }).lean();
  }

  async count(filter?: FilterLikeInput): Promise<number> {
    return this.likeModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
