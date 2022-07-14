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
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';
import { StringService } from '../common/services/string.service';
import { wrap } from '@mikro-orm/core';
import { NotificationType } from '../notification/enum/notification-type.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: EntityRepository<Membership>,
    private notificationService: NotificationService,
    private queryService: QueryService<Membership>,
    private stringService: StringService,
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

  async sendJoinNotification(membership: Membership): Promise<Notification> {
    await wrap(membership.forest).init();
    await wrap(membership.member).init();
    return this.notificationService.create(
      {
        type: NotificationType.JOIN,
        actor: membership.member.id,
        sourceId: membership.id,
        sourceType: NotificationSourceType.MEMBERSHIP,
        user: membership.forest.founder.id,
        content: `${
          membership.member.username
        } joined your forest "${this.stringService.createExcerpt(
          membership.forest.name,
          20,
        )}"`,
      },
      true,
    );
  }

  async join(input: JoinInput): Promise<Membership> {
    const membership = await this.membershipRepository.create(input);
    await this.membershipRepository.persistAndFlush(membership);
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

    await this.membershipRepository.removeAndFlush(membership);

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
