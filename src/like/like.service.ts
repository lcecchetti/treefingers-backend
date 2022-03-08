import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { FilterService } from 'src/filter/filter.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    private filterService: FilterService<LikeDocument>,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.likeModel.findOne(this.prepareFilter(filter)).lean();
  }

  async likeStory(story: string, user: string): Promise<Like> {
    return this.likeModel.create({ story, user });
  }

  async likeComment(comment: string, user: string): Promise<Like> {
    return await this.likeModel.create({ comment, user });
  }

  async dislikeStory(story: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ story, user }).lean();
  }

  async dislikeComment(comment: string, user: string): Promise<Like | null> {
    return this.likeModel.findOneAndDelete({ comment, user }).lean();
  }

  async count(filter?: FilterLikeInput): Promise<number> {
    return this.likeModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterLikeInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
