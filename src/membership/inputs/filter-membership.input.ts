import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from '../../query/inputs/filter.input';

@InputType()
export class FilterMembershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  forest?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  member?: FilterIdInput;

  or?: FilterMembershipInput[];
}
