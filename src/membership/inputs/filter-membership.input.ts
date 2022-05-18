import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterMembershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  readonly forestId?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  readonly memberId?: FilterIdInput;

  readonly or?: FilterMembershipInput[];
}
