import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Followership } from '../followership.entity';
import { FollowershipService } from '../followership.service';

@DataloaderProvider()
export class FollowershipDataloader {
  constructor(private followershipService: FollowershipService) {}

  createDataloader() {
    return new DataLoader<
      { followed: number; follower: number },
      Followership,
      string
    >(
      async (keys) => {
        // get followerships
        const result = await this.followershipService.findMany({
          or: keys.map(({ followed, follower }) => ({
            followed: { eq: followed },
            follower: { eq: follower },
          })),
        });

        // map likes to keys
        return keys.map(({ followed, follower }) =>
          result.find(
            (r) => r.followed.id === followed && r.follower.id === follower,
          ),
        );
      },
      {
        cacheKeyFn: ({ followed, follower }) => `${followed}${follower}`,
      },
    );
  }
}
