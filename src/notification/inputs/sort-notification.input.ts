import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from '../../query/inputs/sort.input';

@InputType()
export class SortNotificationInput {
  @Field(() => SortDirection, { nullable: true })
  id: SortDirection = SortDirection.DESC;

  @Field(() => SortDirection, { nullable: true })
  read: SortDirection;
}
