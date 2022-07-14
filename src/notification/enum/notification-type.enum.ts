import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  JOIN = 'join',
  FOLLOW = 'follow',
  STORY_CREATE = 'story_create',
}

registerEnumType(NotificationType, { name: 'NotificationType' });
