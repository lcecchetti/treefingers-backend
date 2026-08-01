import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Membership } from '../membership.entity';
import { MembershipService } from '../membership.service';

@DataloaderProvider()
export class MembershipDataloader {
  constructor(private membershipService: MembershipService) {}

  createDataloader() {
    return new DataLoader<
      { forest: number; member: number },
      Membership | undefined,
      string
    >(
      async (keys) => {
        // get memberships
        const result = await this.membershipService.findMany({
          or: keys.map(({ forest, member }) => ({
            forest: { eq: forest },
            member: { eq: member },
          })),
        });

        // map membership to keys
        return keys.map(({ forest, member }) =>
          result.find((r) => r.forest.id === forest && r.member.id === member),
        );
      },
      {
        cacheKeyFn: ({ forest, member }) => `${forest}${member}`,
      },
    );
  }
}
