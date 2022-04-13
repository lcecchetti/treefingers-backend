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

  async join(input: JoinInput): Promise<Membership> {
    return this.membershipModel.create(input);
  }

  async leave(input: LeaveInput): Promise<Membership | null> {
    return this.membershipModel.findOneAndDelete(input).lean();
  }

  async count(filter?: FilterMembershipInput): Promise<number> {
    return this.membershipModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterMembershipInput): FilterQuery<Membership> {
    return this.filterService.prepareFilter(filter);
  }
}
