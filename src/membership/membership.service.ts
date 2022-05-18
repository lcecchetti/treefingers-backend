import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from 'src/query/query.service';
import { Repository } from 'typeorm';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private queryService: QueryService<Membership>,
  ) {}

  async findOne(filter?: FilterMembershipInput): Promise<Membership | null> {
    return this.prepareQueryBuilder(filter).getOne();
  }

  async findMany(filter?: FilterMembershipInput): Promise<Membership[]> {
    return this.prepareQueryBuilder(filter).getMany();
  }

  async findById(id: number): Promise<Membership | null> {
    return this.findOne({ id: { eq: id } });
  }

  async join(input: JoinInput): Promise<Membership> {
    return this.membershipRepository.save(input);
  }

  async leave({ forestId, memberId }: LeaveInput): Promise<Membership | null> {
    const membership = await this.findOne({
      forestId: { eq: forestId },
      memberId: { eq: memberId },
    });

    return this.membershipRepository.remove(membership);
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
