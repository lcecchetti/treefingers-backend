import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/query/inputs/filter.input';

@InputType()
export class TagFilterInput extends FilterInput {
  @Field(() => [TagFilterInput], { nullable: true })
  and?: TagFilterInput[];

  @Field(() => [TagFilterInput], { nullable: true })
  or?: TagFilterInput[];

  @Field(() => FilterStringInput, { nullable: true })
  readonly slug?: FilterStringInput;
}
