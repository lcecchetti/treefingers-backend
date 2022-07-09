import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from '../../pagination/args/connection.args';
import { FilterNotificationInput } from '../inputs/filter-notification.input';
import { SortNotificationInput } from '../inputs/sort-notification.input';

@ArgsType()
export class NotificationConnectionArgs extends ConnectionArgs {
  @Field(() => FilterNotificationInput, { nullable: true })
  filter?: FilterNotificationInput = new FilterNotificationInput();

  @Field(() => SortNotificationInput, { nullable: true })
  sort?: SortNotificationInput = new SortNotificationInput();
}
