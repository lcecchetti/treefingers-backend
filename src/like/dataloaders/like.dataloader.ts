import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';
import { Like } from '../like.entity';
import { LikeService } from '../like.service';

@DataloaderProvider()
export class LikeDataloader {
  constructor(private likeService: LikeService) {}

  createDataloader() {
    return new DataLoader<
      { comment?: number; story?: number; user: number },
      Like | undefined,
      string
    >(
      async (keys) => {
        // get likes
        const result = await this.likeService.findMany({
          or: keys.map(({ comment, story, user }) => ({
            comment: comment ? { eq: comment } : undefined,
            story: story ? { eq: story } : undefined,
            user: { eq: user },
          })),
        });

        // map likes to keys
        return keys.map(({ comment, story, user }) =>
          result.find(
            (r) =>
              r.comment?.id === comment &&
              r.story?.id === story &&
              r.user.id === user,
          ),
        );
      },
      {
        cacheKeyFn: ({ comment, story, user }) => `${comment}|${story}|${user}`,
      },
    );
  }
}
