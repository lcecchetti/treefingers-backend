import { Injectable } from '@nestjs/common';
import { Like } from './like.entity';
import { FilterLikeInput } from './inputs/filter-like.input';
import { LikeInput } from './inputs/like.input';
import { DislikeInput } from './inputs/dislike.input';
import { QueryService } from '../query/query.service';
import { SortUserInput } from '../user/inputs/sort-user.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: EntityRepository<Like>,
    private queryService: QueryService<Like>,
  ) {}

  async findOne(filter?: FilterLikeInput): Promise<Like | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterLikeInput): Promise<Like[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Like | null> {
    return this.findOne({ id: { eq: id } });
  }

  async like(input: LikeInput): Promise<Like> {
    const like = await this.likeRepository.create(input);
    await this.likeRepository.persistAndFlush(like);
    return like;
  }

  async dislike({ comment, story, user }: DislikeInput): Promise<Like | null> {
    const like = await this.findOne({
      comment: comment ? { eq: comment } : null,
      story: story ? { eq: story } : null,
      user: { eq: user },
    });

    if (!like) {
      return null;
    }

    await this.likeRepository.removeAndFlush(like);
    return like;
  }

  prepareQueryBuilder(
    filter: FilterLikeInput = new FilterLikeInput(),
    sort: SortUserInput = new SortUserInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.likeRepository.createQueryBuilder(),
      filter,
      sort,
    );
  }
}
