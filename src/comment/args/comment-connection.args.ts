import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from '../../pagination/args/connection.args';
import { FilterCommentInput } from '../inputs/filter-comment.input';
import { SortCommentInput } from '../inputs/sort-comment.input';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
  @Field(() => FilterCommentInput, { nullable: true })
  filter?: FilterCommentInput = new FilterCommentInput();

  @Field(() => SortCommentInput, { nullable: true })
  sort?: SortCommentInput = new SortCommentInput();
}
