import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { SortInput } from 'src/query/inputs/sort.input';
import { FilterStoryInput } from '../inputs/filter-story.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => FilterStoryInput, { nullable: true })
  filter?: FilterStoryInput;

  @Field({ nullable: true })
  readonly sort?: SortInput = new SortInput();
}
