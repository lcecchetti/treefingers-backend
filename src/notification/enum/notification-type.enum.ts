import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  LIKE_COMMENT_FOREST = 'like_comment_forest',
  LIKE_COMMENT_STORY = 'like_comment_story',
  LIKE_STORY = 'like_story',
  COMMENT_FOREST = 'comment_forest',
  COMMENT_STORY = 'comment_story',
  JOIN = 'join',
  FOLLOW = 'follow',
  FOREST_CONTINUE = 'forest_continue',
  STORY_CONTINUE = 'story_continue',
  CHAPTER_CONTINUE = 'chapter_continue',
}

registerEnumType(NotificationType, { name: 'NotificationType' });
