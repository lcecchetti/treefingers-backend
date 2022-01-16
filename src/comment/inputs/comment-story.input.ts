import { Field, ID, InputType } from '@nestjs/graphql';
import { CommentDataInput, CommentInput } from './comment.input';

@InputType()
export class CommentStoryInput extends CommentInput {
  @Field(() => ID)
  story: string;

  @Field(() => CommentDataInput)
  data: CommentDataInput;
}
