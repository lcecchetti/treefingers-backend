import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { FilterFollowershipInput } from '../inputs/filter-followership.input';
import { Followership } from '../followership.entity';
import { FollowershipService } from '../followership.service';

@DataloaderProvider()
export class FollowershipDataloader {
  constructor(private followershipService: FollowershipService) {}

  createDataloader() {
    return new DataLoader<FilterFollowershipInput, Followership, string>(
      async (keys) => {
        // get followerships
        const result = await this.followershipService.findMany({
          or: keys.map(({ followedId, followerId }) => ({
            followedId,
            followerId,
          })),
        });

        // map likes to keys
        return keys.map(({ followedId, followerId }) =>
          result.find(
            (r) => r.followedId === followedId && r.followerId === followerId,
          ),
        );
      },
      {
        cacheKeyFn: ({ followedId, followerId }) =>
          `${followedId}${followerId}`,
      },
    );
  }
}
