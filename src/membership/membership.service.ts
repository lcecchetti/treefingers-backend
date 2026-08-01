import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { QueryService } from '../query/query.service';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';
import { Notification } from '../notification/notification.entity';
import { StringService } from '../common/services/string.service';
import { RequiredEntityData, wrap } from '@mikro-orm/core';
import { NotificationType } from '../notification/enum/notification-type.enum';
import { UrlService } from '../common/services/url.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: EntityRepository<Membership>,
    private notificationService: NotificationService,
    private queryService: QueryService<Membership>,
    private stringService: StringService,
    private urlService: UrlService,
  ) {}

  async findOne(filter?: FilterMembershipInput): Promise<Membership | null> {
    return this.prepareQueryBuilder(filter).getSingleResult();
  }

  async findMany(filter?: FilterMembershipInput): Promise<Membership[]> {
    return this.prepareQueryBuilder(filter).getResult();
  }

  async findById(id: number): Promise<Membership | null> {
    return this.findOne({ id: { eq: id } });
  }

  async sendJoinNotification(
    membership: Membership,
  ): Promise<Notification | null> {
    await wrap(membership.forest).init();
    await wrap(membership.member).init();
    const forestExcerpt = this.stringService.createExcerpt(
      membership.forest.name,
      20,
    );
    return this.notificationService.create(
      {
        type: NotificationType.JOIN,
        actor: membership.member.id,
        targetId: membership.forest.id,
        sourceId: membership.id,
        user: membership.forest.founder.id,
        link: this.urlService.getForestUrl(membership.forest),
        content: `${membership.member.username} joined your forest "${forestExcerpt}"`,
      },
      true,
    );
  }

  async join(input: JoinInput): Promise<Membership> {
    const membership = await this.membershipRepository.create(
      input as RequiredEntityData<Membership>,
    );
    await this.membershipRepository
      .getEntityManager()
      .persist(membership)
      .flush();
    await this.sendJoinNotification(membership);
    return membership;
  }

  async leave({ forest, member }: LeaveInput): Promise<Membership | null> {
    const membership = await this.findOne({
      forest: { eq: forest },
      member: { eq: member },
    });

    if (!membership) {
      return null;
    }

    await this.membershipRepository
      .getEntityManager()
      .remove(membership)
      .flush();

    return membership;
  }

  prepareQueryBuilder(
    filter: FilterMembershipInput = new FilterMembershipInput(),
  ) {
    return this.queryService.prepareQueryBuilder(
      this.membershipRepository.createQueryBuilder(),
      filter,
    );
  }
}
