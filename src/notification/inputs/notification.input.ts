import { NotificationSourceType } from '../enum/notification-source-type.enum';
import { NotificationType } from '../enum/notification-type.enum';

export class NotificationDataInput {
  type: NotificationType;
  user: number;
  content: string;
  link?: string;
  actor?: number;
  sourceId?: number;
  sourceType?: NotificationSourceType;
}
