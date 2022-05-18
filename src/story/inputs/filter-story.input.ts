import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/query/inputs/filter.input';

@InputType()
export class FilterStoryInput extends FilterInput {
  @Field(() => [FilterStoryInput], { nullable: true })
  and?: FilterStoryInput[];

  @Field(() => [FilterStoryInput], { nullable: true })
  or?: FilterStoryInput[];

  @Field(() => FilterIdInput, { nullable: true })
  authorId?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  parentId?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  forestId?: FilterIdInput;

  @Field(() => String, { nullable: true })
  query?: string;
}
