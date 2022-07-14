import { registerEnumType } from '@nestjs/graphql';

export enum NotificationTargetType {
  STORY = 'story',
  FOREST = 'forest',
  USER = 'user',
}

registerEnumType(NotificationTargetType, {
  name: 'NotificationTargetType',
});
