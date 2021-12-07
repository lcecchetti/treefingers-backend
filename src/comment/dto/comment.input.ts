import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { CommentFilterInput } from './comment-filter.input';

@InputType()
@ArgsType()
export class TagInput {
  @Field(() => CommentFilterInput, { nullable: true })
  filter?: CommentFilterInput = new CommentFilterInput();
}
