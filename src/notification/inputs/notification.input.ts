import { NotificationType } from '../enum/notification-type.enum';

export class NotificationDataInput {
  type: NotificationType;
  user: number;
  content: string;
  link?: string;
  actor?: number;
  targetId?: number;
  sourceId?: number;
}
