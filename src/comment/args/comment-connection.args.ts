import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/common/pagination/args/connection.args';
import { StoryFilterInput } from 'src/story/dto/story-filter.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => StoryFilterInput, { nullable: true })
  filter?: StoryFilterInput = new StoryFilterInput();
}
