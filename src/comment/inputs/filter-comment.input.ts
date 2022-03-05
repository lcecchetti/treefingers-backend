import { Field, InputType } from '@nestjs/graphql';
import { FilterIdInput, FilterInput } from 'src/filter/inputs/filter.input';

@InputType()
export class FilterCommentInput extends FilterInput {
  @Field(() => [FilterCommentInput], { nullable: true })
  and?: FilterCommentInput[];

  @Field(() => [FilterCommentInput], { nullable: true })
  or?: FilterCommentInput[];

  @Field(() => FilterIdInput, { nullable: true })
  story?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  forest?: FilterIdInput;

  @Field(() => FilterIdInput, { nullable: true })
  user?: FilterIdInput;
}
