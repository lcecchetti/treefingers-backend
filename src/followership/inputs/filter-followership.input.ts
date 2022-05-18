import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterFollowershipInput extends FilterInput {
  @Field(() => FilterIdInput, { nullable: true })
  followedId?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  followerId?: FilterIdInput;

  or?: FilterFollowershipInput[];
}
