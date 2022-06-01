import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { QueryService } from '../query/query.service';
import { Followership } from './followership.entity';
import { FilterFollowershipInput } from './inputs/filter-followership.input';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';

@Injectable()
export class FollowershipService {
  constructor(
    @InjectRepository(Followership)
    private followershipRepository: EntityRepository<Followership>,
    private queryService: QueryService<Followership>,
  ) {}

  async findOne(
    filter?: FilterFollowershipInput,
  ): Promise<Followership | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterFollowershipInput): Promise<Followership[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Followership | null> {
    return this.findOne({ id: { eq: id } });
  }

  async follow(input: FollowInput): Promise<Followership> {
    const followership = await this.followershipRepository.create(input);
    await this.followershipRepository.persistAndFlush(followership);
    return followership;
  }

  async unfollow({
    followed,
    follower,
  }: UnfollowInput): Promise<Followership | null> {
    const followership = await this.findOne({
      followed: { eq: followed },
      follower: { eq: follower },
    });

    if (!followership) {
      return null;
    }

    await this.followershipRepository.removeAndFlush(followership);

    return followership;
  }

  prepareQueryBuilder(
    filter: FilterFollowershipInput = new FilterFollowershipInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.followershipRepository.createQueryBuilder(),
      filter,
    );
  }
}
