import { ArgsType, Field } from '@nestjs/graphql';
import { CommentFilterInput } from 'src/comment/dto/comment-filter.input';
import { ConnectionArgs } from 'src/common/pagination/args/connection.args';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
  @Field(() => CommentFilterInput, { nullable: true })
  filter?: CommentFilterInput = new CommentFilterInput();
}
