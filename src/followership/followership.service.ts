import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { NotificationReferenceType } from '../notification/enum/notification-reference-type.enum';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';
import { NotificationWhat } from '../notification/enum/notification-what.enum';
import { NotificationService } from '../notification/notification.service';
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
    private notificationService: NotificationService,
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

    await this.notificationService.create(
      {
        what: NotificationWhat.FOLLOW,
        who: followership.follower.id,
        referenceId: followership.follower.id,
        referenceType: NotificationReferenceType.USER,
        sourceId: followership.id,
        sourceType: NotificationSourceType.FOLLOWERSHIP,
        user: followership.followed.id,
      },
      true,
    );

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
