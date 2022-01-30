import { Field, ID, InputType } from '@nestjs/graphql';
import { CommentInput } from './comment.input';

@InputType()
export class CommentForestInput extends CommentInput {
  @Field(() => ID)
  forest: string;
}
