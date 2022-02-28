import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { FilterCommentInput } from '../inputs/filter-comment.input';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
  @Field(() => FilterCommentInput, { nullable: true })
  readonly filter?: FilterCommentInput;
}
