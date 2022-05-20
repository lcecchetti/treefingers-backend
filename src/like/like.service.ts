import { Injectable } from '@nestjs/common';
import { Like } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryService } from 'src/query/query.service';
import { SortUserInput } from 'src/user/inputs/sort-user.input';
import { FilterUserInput } from 'src/user/inputs/filter-user.input';
import { CommentLike } from './comment-like.entity';
import { StoryLike } from './story-like.entity';
import { LikeableEntityType } from './enums/likeable-entity-type.enum';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(StoryLike)
    private storyLikeRepository: Repository<StoryLike>,
    private queryService: QueryService<Like>,
  ) {}

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterLikeInput): Promise<Like[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async findById(id: number): Promise<Like | null> {
    return this.findOne({ id: { eq: id } });
  }

  async like(input: LikeInput): Promise<Like> {
    switch (input.entityType) {
      case LikeableEntityType.Comment:
        return this.commentLikeRepository.save(input);
      case LikeableEntityType.Story:
        return this.storyLikeRepository.save(input);
    }
  }

  async dislike({
    entityId,
    entityType,
    userId,
  }: DislikeInput): Promise<Like | null> {
    const like = await this.findOne({
      entityId: { eq: entityId },
      entityType: { eq: entityType },
      userId: { eq: userId },
    });

    if (!like) {
      return null;
    }

    await this.likeRepository.delete(like.id);

    return like;
  }

  prepareQueryBuilder(
    filter: FilterUserInput = new FilterUserInput(),
    sort: SortUserInput = new SortUserInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.likeRepository.createQueryBuilder(),
      filter,
      sort,
    );
  }
}
