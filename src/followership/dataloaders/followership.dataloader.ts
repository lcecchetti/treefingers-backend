import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterFollowershipInput } from '../inputs/filter-followership.input';
import { Followership, FollowershipDocument } from '../followership.entity';

@DataloaderProvider()
export class FollowershipDataloader {
  constructor(
    @InjectModel('Followership')
    private followershipModel: Model<FollowershipDocument>,
  ) {}

  createDataloader() {
    return new DataLoader<FilterFollowershipInput, Followership, string>(
      async (keys) => {
        // get followerships
        const result = await this.followershipModel.find({
          $or: keys.map(({ followed, follower }) => ({
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
