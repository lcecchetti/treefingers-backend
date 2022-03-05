import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';

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

  @Field(() => FilterIdInput, { nullable: true })
  root?: FilterIdInput;

  @Field(() => String, { nullable: true })
  query?: string;
}
