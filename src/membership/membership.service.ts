import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { QueryService } from 'src/query/query.service';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: EntityRepository<Membership>,
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

  async join(input: JoinInput): Promise<Membership> {
    const membership = await this.membershipRepository.create(input);
    await this.membershipRepository.persistAndFlush(membership);
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
