import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FilterService } from 'src/filter/filter.service';
import { ForestService } from 'src/forest/forest.service';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership, MembershipDocument } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel('Membership')
    private membershipModel: Model<MembershipDocument>,
    private forestService: ForestService,
    private filterService: FilterService<MembershipDocument>,
  ) {}

  async findById(_id: string): Promise<Membership | null> {
    return this.membershipModel.findById(_id).lean();
  }

  async findOne(filter?: FilterMembershipInput): Promise<Membership | null> {
    return this.membershipModel.findOne(this.prepareFilter(filter)).lean();
  }

  async findMany(filter?: FilterMembershipInput): Promise<Membership[]> {
    return this.membershipModel.find(this.prepareFilter(filter)).lean();
  }

  async join(input: JoinInput): Promise<Membership> {
    const membership = await this.membershipModel.create(input);

    await this.forestService.updateMembersCount(input.forest, 1);

    return membership;
  }

  async leave(input: LeaveInput): Promise<Membership | null> {
    const membership = await this.membershipModel
      .findOneAndDelete(input)
      .lean();

    if (!membership) return null;

    await this.forestService.updateMembersCount(input.forest, -1);

    return membership;
  }

  async count(filter?: FilterMembershipInput): Promise<number> {
    return this.membershipModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterMembershipInput): FilterQuery<Membership> {
    return this.filterService.prepareFilter(filter);
  }
}
