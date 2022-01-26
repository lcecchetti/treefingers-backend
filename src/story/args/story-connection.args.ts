import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/query/args/connection.args';
import { FilterStoryInput } from '../inputs/filter-story.input';
import { SortStoryInput } from '../inputs/sort-story.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => FilterStoryInput, { nullable: true })
  filter?: FilterStoryInput;

  @Field(() => SortStoryInput, { nullable: true })
  sort?: SortStoryInput;
}
