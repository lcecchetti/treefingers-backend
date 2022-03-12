import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/filter/inputs/filter.input';

@InputType()
export class FilterForestInput extends FilterInput {
  @Field(() => [FilterForestInput], { nullable: true })
  and?: FilterForestInput[];

  @Field(() => [FilterForestInput], { nullable: true })
  or?: FilterForestInput[];

  @Field(() => FilterStringInput, { nullable: true })
  name?: FilterStringInput;

  @Field(() => String, { nullable: true })
  query?: string;
}
