import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/pagination/args/connection.args';
import { SortInput } from 'src/pagination/inputs/sort.input';
import { FilterCommentInput } from '../inputs/filter-comment.input';

@ArgsType()
export class CommentConnectionArgs extends ConnectionArgs {
  @Field(() => FilterCommentInput, { nullable: true })
  readonly filter?: FilterCommentInput = new FilterCommentInput();

  @Field(() => SortInput, { nullable: true })
  readonly sort?: SortInput = new SortInput();
}
