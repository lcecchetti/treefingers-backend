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
          or: keys.map(({ followed, follower }) => ({
            followed,
            follower,
          })),
        });

        // map likes to keys
        return keys.map(({ followed, follower }) =>
          result.find(
            (r) =>
              String(r.followed) === followed &&
              String(r.follower) === follower,
          ),
        );
      },
      {
        cacheKeyFn: ({ follower, followed }) => `${follower}${followed}`,
      },
    );
  }
}
