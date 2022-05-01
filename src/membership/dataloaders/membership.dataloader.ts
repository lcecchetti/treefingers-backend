import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Membership } from '../membership.entity';
import { FilterMembershipInput } from '../inputs/filter-membership.input';
import { MembershipService } from '../membership.service';

@DataloaderProvider()
export class MembershipDataloader {
  constructor(private membershipService: MembershipService) {}

  createDataloader() {
    return new DataLoader<FilterMembershipInput, Membership, string>(
      async (keys) => {
        // get memberships
        const result = await this.membershipService.findMany({
          or: keys.map(({ forest, member }) => ({
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
