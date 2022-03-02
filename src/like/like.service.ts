import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { QueryService } from 'src/query/query.service';
import { FilterLikeInput } from './inputs/filter-like.input';

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

  async likeStory(story: string, user: string): Promise<Like> {
    return this.likeModel.create({ story, user });
  }

  async likeComment(comment: string, user: string): Promise<Like> {
    return await this.likeModel.create({ comment, user });
  }

  async likeAuthor(author: string, user: string): Promise<Like> {
    return this.likeModel.create({ author, user });
  }

  async likeForest(forest: string, user: string): Promise<Like> {
    return await this.likeModel.create({ forest, user });
  }

  async dislikeStory(story: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ story, user }).lean();
  }

  async dislikeComment(comment: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ comment, user }).lean();
  }

  async dislikeAuthor(author: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ author, user }).lean();;
  }

  async dislikeForest(forest: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ forest, user }).lean();
  }

  async count(filter?: FilterLikeInput): Promise<number> {
    return this.likeModel.count(this.queryService.gqlFilterToMongo(filter));
  }
}
