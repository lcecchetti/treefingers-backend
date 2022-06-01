import { Field, InputType } from '@nestjs/graphql';
import {
  FilterInput,
  FilterIntInput,
  FilterStringInput,
} from '../../query/inputs/filter.input';

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

  @Field(() => FilterIntInput, { nullable: true })
  storiesCount?: FilterIntInput;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  followed?: boolean;

  isActive?: boolean;
}
