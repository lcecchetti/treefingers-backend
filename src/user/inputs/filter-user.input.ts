import { Field, InputType } from '@nestjs/graphql';
import { FilterInput, FilterStringInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterUserInput extends FilterInput {
  @Field(() => [FilterUserInput], { nullable: true })
  and?: FilterUserInput[];

  @Field(() => [FilterUserInput], { nullable: true })
  or?: FilterUserInput[];

  @Field(() => FilterStringInput, { nullable: true })
  email?: FilterStringInput;

  @Field(() => FilterStringInput, { nullable: true })
  username?: FilterStringInput;

  @Field(() => String, { nullable: true })
  query?: string;

  isActive?: boolean;
}
