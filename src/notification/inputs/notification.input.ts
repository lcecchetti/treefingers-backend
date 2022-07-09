import { NotificationReferenceType } from '../enum/notification-reference-type.enum';
import { NotificationSourceType } from '../enum/notification-source-type.enum';
import { NotificationWhat } from '../enum/notification-what.enum';

export class NotificationDataInput {
  user: number;
  what: NotificationWhat;
  who?: number;
  referenceId?: number;
  referenceType?: NotificationReferenceType;
  sourceId?: number;
  sourceType?: NotificationSourceType;
}
