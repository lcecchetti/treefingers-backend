import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FilterService } from 'src/filter/filter.service';
import { Followership, FollowershipDocument } from './followership.entity';
import { FilterFollowershipInput } from './inputs/filter-followership.input';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';

@Injectable()
export class FollowershipService {
  constructor(
    @InjectModel('Followership')
    private followershipModel: Model<FollowershipDocument>,
    private filterService: FilterService<FollowershipDocument>,
  ) {}

  async findById(_id: string): Promise<Followership | null> {
    return this.followershipModel.findById(_id).lean();
  }

  async findOne(
    filter?: FilterFollowershipInput,
  ): Promise<Followership | null> {
    return this.followershipModel.findOne(this.prepareFilter(filter)).lean();
  }

  async follow(
    { followed }: FollowInput,
    follower: string,
  ): Promise<Followership> {
    return this.followershipModel.create({ followed, follower });
  }

  async unfollow(
    { followed }: UnfollowInput,
    follower: string,
  ): Promise<Followership | null> {
    return this.followershipModel
      .findOneAndDelete({ followed, follower })
      .lean();
  }

  async count(filter?: FilterFollowershipInput): Promise<number> {
    return this.followershipModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterFollowershipInput): FilterQuery<Followership> {
    return this.filterService.prepareFilter(filter);
  }
}
