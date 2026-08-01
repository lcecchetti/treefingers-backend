import { Field, InputType } from '@nestjs/graphql';
import {
  FilterIdInput,
  FilterInput,
  FilterIntInput,
  FilterStringInput,
} from '../../query/inputs/filter.input';

@InputType()
export class FilterForestInput extends FilterInput {
  @Field(() => [FilterForestInput], { nullable: true })
  and?: FilterForestInput[];

  @Field(() => [FilterForestInput], { nullable: true })
  or?: FilterForestInput[];

  @Field(() => FilterStringInput, { nullable: true })
  name?: FilterStringInput;

  @Field(() => FilterIdInput, { nullable: true })
  founder?: FilterIdInput;

  @Field(() => FilterIntInput, { nullable: true })
  membersCount?: FilterIntInput;

  @Field(() => FilterIntInput, { nullable: true })
  storiesCount?: FilterIntInput;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  joined?: boolean;
}
