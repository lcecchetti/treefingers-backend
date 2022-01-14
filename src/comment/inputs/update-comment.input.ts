import { Field, InputType } from '@nestjs/graphql';
import { CommentFilterInput } from './comment-filter.input';
import { CreateCommentDataInput } from './create-comment.input';

@InputType()
export class UpdateCommentDataInput extends CreateCommentDataInput {}

@InputType()
export class UpdateCommentInput {
  @Field(() => UpdateCommentDataInput)
  data: UpdateCommentDataInput;

  @Field(() => CommentFilterInput)
  filter: CommentFilterInput;
}
