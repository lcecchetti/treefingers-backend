import { NotificationSourceType } from '../enum/notification-source-type.enum';
import { NotificationTargetType } from '../enum/notification-target-type.enum';
import { NotificationType } from '../enum/notification-type.enum';

export class NotificationDataInput {
  type: NotificationType;
  user: number;
  content: string;
  link?: string;
  actor?: number;
  targetId?: number;
  targetType?: NotificationTargetType;
  sourceId?: number;
  sourceType?: NotificationSourceType;
}
