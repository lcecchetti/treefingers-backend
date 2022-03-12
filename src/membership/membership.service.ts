import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FilterService } from 'src/filter/filter.service';
import { FilterMembershipInput } from './inputs/filter-membership.input';
import { JoinInput } from './inputs/join.input';
import { LeaveInput } from './inputs/leave.input';
import { Membership, MembershipDocument } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel('Membership')
    private membershipModel: Model<MembershipDocument>,
    private filterService: FilterService<MembershipDocument>,
  ) {}

  async findById(_id: string): Promise<Membership | null> {
    return this.membershipModel.findById(_id).lean();
  }

  async findOne(filter?: FilterMembershipInput): Promise<Membership | null> {
    return this.membershipModel.findOne(this.prepareFilter(filter)).lean();
  }

  async join({ forest }: JoinInput, user: string): Promise<Membership> {
    return this.membershipModel.create({ forest, user });
  }

  async leave(
    { forest }: LeaveInput,
    user: string,
  ): Promise<Membership | null> {
    return this.membershipModel.findOneAndDelete({ forest, user }).lean();
  }

  async count(filter?: FilterMembershipInput): Promise<number> {
    return this.membershipModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterMembershipInput): FilterQuery<Comment> {
    return this.filterService.prepareFilter(filter);
  }
}
