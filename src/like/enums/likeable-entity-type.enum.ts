import { registerEnumType } from '@nestjs/graphql';

export enum LikeableEntityType {
  CommentLike = 'CommentLike',
  StoryLike = 'StoryLike',
}

registerEnumType(LikeableEntityType, { name: 'LikeableEntityType' });
