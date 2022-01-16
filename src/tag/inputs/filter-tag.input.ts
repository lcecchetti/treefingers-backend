import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterTagInput extends FilterInput {
  @Field(() => [FilterTagInput], { nullable: true })
  and?: FilterTagInput[];

  @Field(() => [FilterTagInput], { nullable: true })
  or?: FilterTagInput[];

  @Field(() => FilterStringInput, { nullable: true })
  readonly slug?: FilterStringInput;
}
