import { registerEnumType } from '@nestjs/graphql';

export enum NotificationSourceType {
  STORY = 'story',
  COMMENT = 'comment',
  FOLLOWERSHIP = 'followership',
  MEMBERSHIP = 'membership',
  LIKE = 'like',
}

registerEnumType(NotificationSourceType, {
  name: 'NotificationSourceType',
});
