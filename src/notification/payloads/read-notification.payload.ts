import { Field, ObjectType } from '@nestjs/graphql';
import { Notification } from '../notification.entity';

@ObjectType()
export class ReadNotificationPayload {
  @Field(() => Notification)
  readonly notification: Notification;
}
