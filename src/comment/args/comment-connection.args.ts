import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/common/pagination/args/connection.args';
import { CommentFilterInput } from '../dto/comment-filter.input';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
  @Field(() => CommentFilterInput, { nullable: true })
  filter?: CommentFilterInput = new CommentFilterInput();
}
