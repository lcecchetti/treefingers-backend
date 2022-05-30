import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectionArgs } from 'src/pagination/args/connection.args';
import { FilterStoryInput } from '../inputs/filter-story.input';
import { SortStoryInput } from '../inputs/sort-story.input';

@ArgsType()
export class StoryConnectionArgs extends ConnectionArgs {
  @Field(() => FilterStoryInput, { nullable: true })
  filter?: FilterStoryInput = new FilterStoryInput();

  @Field(() => SortStoryInput, { nullable: true })
  sort?: SortStoryInput = new SortStoryInput();

  @Field({ nullable: true })
  query?: string;
}
