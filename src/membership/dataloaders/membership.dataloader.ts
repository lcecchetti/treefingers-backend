import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from '../membership.entity';
import { FilterMembershipInput } from '../inputs/filter-membership.input';

@DataloaderProvider()
export class MembershipDataloader {
  constructor(
    @InjectModel('Membership')
    private membershipModel: Model<MembershipDocument>,
  ) {}

  createDataloader() {
    return new DataLoader<FilterMembershipInput, Membership, string>(
      async (keys) => {
        // get memberships
        const result = await this.membershipModel.find({
          $or: keys.map(({ forest, member }) => ({
            forest,
            member,
          })),
        });

        // map membership to keys
        return keys.map(({ forest, member }) =>
          result.find(
            (r) => String(r.forest) === forest && String(r.member) === member,
          ),
        );
      },
      {
        cacheKeyFn: ({ forest, member }) => `${forest}${member}`,
      },
    );
  }
}
