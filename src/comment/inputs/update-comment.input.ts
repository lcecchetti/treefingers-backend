import { Field, InputType } from '@nestjs/graphql';
import { CreateCommentDataInput } from './create-comment.input';
import { FilterCommentInput } from './filter-comment.input';

@InputType()
export class UpdateCommentDataInput extends CreateCommentDataInput {}

@InputType()
export class UpdateCommentInput {
  @Field(() => UpdateCommentDataInput)
  data: UpdateCommentDataInput;

  @Field(() => FilterCommentInput)
  filter: FilterCommentInput;
}
