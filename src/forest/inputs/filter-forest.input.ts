import { Field, InputType } from '@nestjs/graphql';
import {
  FilterIdInput,
  FilterInput,
  FilterStringInput,
} from 'src/query/inputs/filter.input';

@InputType()
export class FilterForestInput extends FilterInput {
  @Field(() => [FilterForestInput], { nullable: true })
  and?: FilterForestInput[];

  @Field(() => [FilterForestInput], { nullable: true })
  or?: FilterForestInput[];

  @Field(() => FilterStringInput, { nullable: true })
  name?: FilterStringInput;

  @Field(() => FilterIdInput, { nullable: true })
  founderId?: FilterIdInput;

  @Field(() => String, { nullable: true })
  query?: string;
}
