import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterForestInput extends FilterInput {
  @Field(() => [FilterForestInput], { nullable: true })
  and?: FilterForestInput[];

  @Field(() => [FilterForestInput], { nullable: true })
  or?: FilterForestInput[];

  @Field(() => FilterStringInput, { nullable: true })
  slug?: FilterStringInput;

  @Field(() => String, { nullable: true })
  query?: string;
}
