import { Field, InputType } from '@nestjs/graphql';
import {
  FilterBooleanInput,
  FilterIdInput,
  FilterInput,
  FilterStringInput,
} from '../../query/inputs/filter.input';
@InputType()
export class FilterNotificationInput extends FilterInput {
  @Field(() => [FilterNotificationInput], { nullable: true })
  and?: FilterNotificationInput[];

  @Field(() => [FilterNotificationInput], { nullable: true })
  or?: FilterNotificationInput[];

  @Field(() => FilterBooleanInput, { nullable: true })
  read?: FilterBooleanInput;

  user?: FilterIdInput;
  actor?: FilterIdInput;
  type?: FilterStringInput;
  referenceId?: FilterIdInput;
  referenceType?: FilterStringInput;
}
