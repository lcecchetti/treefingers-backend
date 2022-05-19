import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from 'src/query/query.service';
import { Repository } from 'typeorm';
import { Followership } from './followership.entity';
import { FilterFollowershipInput } from './inputs/filter-followership.input';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';

@Injectable()
export class FollowershipService {
  constructor(
    @InjectRepository(Followership)
    private followershipRepository: Repository<Followership>,
    private queryService: QueryService<Followership>,
  ) {}

  async findOne(
    filter?: FilterFollowershipInput,
  ): Promise<Followership | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterFollowershipInput): Promise<Followership[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async findById(id: number): Promise<Followership | null> {
    return this.findOne({ id: { eq: id } });
  }

  async follow(input: FollowInput): Promise<Followership> {
    return this.followershipRepository.save(input);
  }

  async unfollow({
    followedId,
    followerId,
  }: UnfollowInput): Promise<Followership | null> {
    const followership = await this.findOne({
      followedId: { eq: followedId },
      followerId: { eq: followerId },
    });

    if (!followership) {
      return null;
    }

    await this.followershipRepository.delete(followership.id);

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
