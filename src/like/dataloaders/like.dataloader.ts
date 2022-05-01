import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Like, LikeDocument } from '../like.entity';
import { FilterLikeInput } from '../inputs/filter-like.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@DataloaderProvider()
export class LikeDataloader {
  constructor(@InjectModel('Like') private likeModel: Model<LikeDocument>) {}

  createDataloader() {
    return new DataLoader<FilterLikeInput, Like, string>(
      async (keys) => {
        // get likes
        const result = await this.likeModel.find({
          $or: keys.map(({ entityType, entity, user }) => ({
            entityType,
            entity,
            user,
          })),
        });

        // map likes to keys
        return keys.map(({ entityType, entity, user }) =>
          result.find(
            (r) =>
              r.entityType === entityType &&
              String(r.entity) === entity &&
              String(r.user) === user,
          ),
        );
      },
      {
        cacheKeyFn: ({ entityType, entity, user }) =>
          `${entityType}${entity}${user}`,
      },
    );
  }
}
