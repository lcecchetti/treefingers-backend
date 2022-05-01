import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';

@InputType()
export class FilterMembershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly forest?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly member?: FilterIdInput;

  readonly or?: FilterMembershipInput[];
}
