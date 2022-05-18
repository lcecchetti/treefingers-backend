import * as DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Like } from '../like.entity';
import { LikeService } from '../like.service';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@DataloaderProvider()
export class LikeDataloader {
  constructor(private likeService: LikeService) {}

  createDataloader() {
    return new DataLoader<
      { entityType: LikeableEntityType; entityId: number; userId: number },
      Like,
      string
    >(
      async (keys) => {
        // get likes
        const result = await this.likeService.findMany({
          or: keys.map(({ entityType, entityId, userId }) => ({
            entityType: { eq: entityType },
            entityId: { eq: entityId },
            userId: { eq: userId },
          })),
        });

        // map likes to keys
        return keys.map(({ entityType, entityId, userId }) =>
          result.find(
            (r) =>
              r.entityType === entityType &&
              r.entityId === entityId &&
              r.userId === userId,
          ),
        );
      },
      {
        cacheKeyFn: ({ entityType, entityId, userId }) =>
          `${entityType}${entityId}${userId}`,
      },
    );
  }
}
