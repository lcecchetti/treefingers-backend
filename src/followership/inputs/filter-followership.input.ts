import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterFollowershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  followed?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  follower?: FilterIdInput;

  or?: FilterFollowershipInput[];
}
