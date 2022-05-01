import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FilterService } from 'src/filter/filter.service';
import { UserDocument } from 'src/user/user.entity';
import { Followership, FollowershipDocument } from './followership.entity';
import { FilterFollowershipInput } from './inputs/filter-followership.input';
import { FollowInput } from './inputs/follow.input';
import { UnfollowInput } from './inputs/unfollow.input';

@Injectable()
export class FollowershipService {
  constructor(
    @InjectModel('Followership')
    private followershipModel: Model<FollowershipDocument>,
    @InjectModel('User')
    private userModel: Model<UserDocument>,
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

  async findMany(filter?: FilterFollowershipInput): Promise<Followership[]> {
    return this.followershipModel.find(this.prepareFilter(filter)).lean();
  }

  async follow(input: FollowInput): Promise<Followership> {
    const followership = await this.followershipModel.create(input);

    // update user followers count
    await this.userModel.findByIdAndUpdate(input.followed, {
      $inc: { followersCount: 1 },
    });

    return followership;
  }

  async unfollow(input: UnfollowInput): Promise<Followership | null> {
    const followership = await this.followershipModel
      .findOneAndDelete(input)
      .lean();

    if (!followership) return null;

    // update users followers count
    await this.userModel.updateOne(
      { _id: input.followed, followersCount: { $gt: 0 } },
      { $inc: { followersCount: -1 } },
    );

    return followership;
  }

  async count(filter?: FilterFollowershipInput): Promise<number> {
    return this.followershipModel.count(this.prepareFilter(filter));
  }

  prepareFilter(filter: FilterFollowershipInput): FilterQuery<Followership> {
    return this.filterService.prepareFilter(filter);
  }
}
