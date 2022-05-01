import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Like } from '../like.entity';
import { FilterLikeInput } from '../inputs/filter-like.input';
import { LikeService } from '../like.service';

@DataloaderProvider()
export class LikeDataloader {
  constructor(private likeService: LikeService) {}

  createDataloader() {
    return new DataLoader<FilterLikeInput, Like, string>(
      async (keys) => {
        // get likes
        const result = await this.likeService.findMany({
          or: keys.map(({ entityType, entity, user }) => ({
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
