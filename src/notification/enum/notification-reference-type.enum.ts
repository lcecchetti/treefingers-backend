import { registerEnumType } from '@nestjs/graphql';

export enum NotificationReferenceType {
  STORY = 'story',
  FOREST = 'forest',
  USER = 'user',
}

registerEnumType(NotificationReferenceType, {
  name: 'NotificationReferenceType',
});
