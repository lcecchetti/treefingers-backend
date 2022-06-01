import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from '../../query/inputs/filter.input';

@InputType()
export class FilterLikeInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  comment?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  user?: FilterIdInput;

  or?: FilterLikeInput[];
}
