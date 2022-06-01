import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from '../../query/inputs/filter.input';

@InputType()
export class FilterStoryInput extends FilterInput {
  @Field(() => [FilterStoryInput], { nullable: true })
  and?: FilterStoryInput[];

  @Field(() => [FilterStoryInput], { nullable: true })
  or?: FilterStoryInput[];

  @Field(() => FilterIdInput, { nullable: true })
  author?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  parent?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  forest?: FilterIdInput;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  liked?: boolean;
}
