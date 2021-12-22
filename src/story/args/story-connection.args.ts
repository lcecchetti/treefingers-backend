import { ArgsType, Field } from '@nestjs/graphql';
import { CommentFilterInput } from 'src/comment/dto/comment-filter.input';
import { ConnectionArgs } from 'src/common/pagination/args/connection.args';
import { StoryFilterInput } from '../dto/story-filter.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => CommentFilterInput, { nullable: true })
  filter?: StoryFilterInput = new StoryFilterInput();
}
