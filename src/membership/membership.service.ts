import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { ForestService } from '../forest/forest.service';
import { NotificationReferenceType } from '../notification/enum/notification-reference-type.enum';
import { NotificationWhat } from '../notification/enum/notification-what.enum';
import { NotificationService } from '../notification/notification.service';
import { QueryService } from '../query/query.service';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';
import { Notification } from '../notification/notification.entity';
import { NotificationSourceType } from '../notification/enum/notification-source-type.enum';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: EntityRepository<Membership>,
    private notificationService: NotificationService,
    private forestService: ForestService,
    private queryService: QueryService<Membership>,
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
    const forest = await this.forestService.findById(membership.forest.id);
    return this.notificationService.create(
      {
        what: NotificationWhat.JOIN,
        who: membership.member.id,
        referenceId: membership.forest.id,
        referenceType: NotificationReferenceType.FOREST,
        sourceId: membership.id,
        sourceType: NotificationSourceType.MEMBERSHIP,
        user: forest.founder.id,
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
