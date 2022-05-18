import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Membership } from '../membership.entity';
import { MembershipService } from '../membership.service';

@DataloaderProvider()
export class MembershipDataloader {
  constructor(private membershipService: MembershipService) {}

  createDataloader() {
    return new DataLoader<
      { forestId: number; memberId: number },
      Membership,
      string
    >(
      async (keys) => {
        // get memberships
        const result = await this.membershipService.findMany({
          or: keys.map(({ forestId, memberId }) => ({
            forestId: { eq: forestId },
            memberId: { eq: memberId },
          })),
        });

        // map membership to keys
        return keys.map(({ forestId, memberId }) =>
          result.find(
            (r) => r.forestId === forestId && r.memberId === memberId,
          ),
        );
      },
      {
        cacheKeyFn: ({ forestId, memberId }) => `${forestId}${memberId}`,
      },
    );
  }
}
