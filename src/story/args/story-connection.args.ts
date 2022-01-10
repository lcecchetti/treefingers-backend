import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { StoryFilterInput } from '../dto/story-filter.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => StoryFilterInput, { nullable: true })
  filter?: StoryFilterInput;
}
