import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { ConnectionInput } from 'src/common/pagination/dto/connection.input';
import { CommentFilterInput } from 'src/comment/dto/comment-filter.input';

@InputType()
@ArgsType()
export class CommentsInput extends ConnectionInput {
  @Field(() => CommentFilterInput, { nullable: true })
  filter?: CommentFilterInput = new CommentFilterInput();
}
