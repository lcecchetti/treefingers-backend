import { registerEnumType } from '@nestjs/graphql';

export enum NotificationWhat {
  LIKE_COMMENT = 'like_comment',
  LIKE_STORY = 'like_story',
  LIKE_CHAPTER = 'like_chapter',
  COMMENT_FOREST = 'comment_forest',
  COMMENT_STORY = 'comment_story',
  COMMENT_CHAPTER = 'comment_chapter',
  JOIN = 'join',
  FOLLOW = 'follow',
  STORY_CREATE = 'story_create',
  STORY_CONTINUE = 'story_continue',
  CHAPTER_CONTINUE = 'chapter_continue',
}

registerEnumType(NotificationWhat, { name: 'NotificationWhat' });
