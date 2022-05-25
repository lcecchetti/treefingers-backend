import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Like } from '../like.entity';
import { LikeService } from '../like.service';
import { LikeableEntityType } from '../enums/likeable-entity-type.enum';

@DataloaderProvider()
export class LikeDataloader {
  constructor(private likeService: LikeService) {}

  createDataloader() {
    return new DataLoader<
      { entityType: LikeableEntityType; entity: number; user: number },
      Like,
      string
    >(
      async (keys) => {
        // get likes
        const result = await this.likeService.findMany({
          or: keys.map(({ entityType, entity, user }) => ({
            entityType: { eq: entityType },
            entity: { eq: entity },
            user: { eq: user },
          })),
        });

        // map likes to keys
        return keys.map(({ entityType, entity, user }) =>
          result.find(
            (r) =>
              r.entityType === entityType &&
              r.entity === entity &&
              r.user.id === user,
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
