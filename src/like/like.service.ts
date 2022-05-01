import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { FilterService } from 'src/filter/filter.service';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';
import { CommentService } from 'src/comment/comment.service';
import { StoryService } from 'src/story/story.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private likeModel: Model<LikeDocument>,
    private commentService: CommentService,
    private storyService: StoryService,
    private filterService: FilterService<LikeDocument>,
  ) {}

  async findById(_id: string): Promise<Like | null> {
    return this.likeModel.findById(_id).lean();
  }

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.likeModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterLikeInput): Promise<Like[]> {
    return this.likeModel.find(this.prepareFilter(filter)).lean();
  }

  async like(input: LikeInput): Promise<Like> {
    const like = await this.likeModel.create(input);

    let service;
    switch (input.entityType) {
      case LikeableEntityType.Comment:
        service = this.commentService;
        break;
      case LikeableEntityType.Story:
        service = this.storyService;
        break;
    }

    await service.updateLikesCount(input.entity, 1);

    return like;
  }

  async dislike(input: DislikeInput): Promise<Like | null> {
    const like = await this.likeModel.findOneAndDelete(input).lean();

    if (!like) return null;

    let service;
    switch (input.entityType) {
      case LikeableEntityType.Comment:
        service = this.commentService;
        break;
      case LikeableEntityType.Story:
        service = this.storyService;
        break;
    }

    await service.updateLikesCount(input.entity, -1);

    return like;
  }

  async count(filter?: FilterLikeInput): Promise<number> {
    return this.likeModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterLikeInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
