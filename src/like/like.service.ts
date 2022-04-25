import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { FilterService } from 'src/filter/filter.service';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { CommentDocument } from 'src/comment/comment.entity';
import { StoryDocument } from 'src/story/story.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    @InjectModel('Story') private storyModel: Model<StoryDocument>,
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private filterService: FilterService<LikeDocument>,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.likeModel.findOne(this.prepareFilter(filter)).lean();
  }

  async like(input: LikeInput): Promise<Like> {
    const like = await this.likeModel.create(input);

    // pick likeable entity model
    let model;
    switch (input.entityType) {
      case LikeableEntityType.Comment:
        model = this.commentModel;
        break;
      case LikeableEntityType.Story:
        model = this.storyModel;
        break;
    }

    // update likes count
    await model.findByIdAndUpdate(input.entity, { $inc: { likesCount: 1 } });

    return like;
  }

  async dislike(input: DislikeInput): Promise<Like | null> {
    const like = await this.likeModel.findOneAndDelete(input).lean();

    if (!like) return null;

    // pick likeable entity model
    let model;
    switch (input.entityType) {
      case LikeableEntityType.Comment:
        model = this.commentModel;
        break;
      case LikeableEntityType.Story:
        model = this.storyModel;
        break;
    }

    // update likes count
    await model.updateOne(
      { _id: input.entity, likesCount: { $gt: 0 } },
      { $inc: { likesCount: -1 } },
    );

    return like;
  }

  async count(filter?: FilterLikeInput): Promise<number> {
    return this.likeModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterLikeInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
