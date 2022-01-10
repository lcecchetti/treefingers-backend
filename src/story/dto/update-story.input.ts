import { Field, InputType } from '@nestjs/graphql';
import { CreateStoryDataInput } from './create-story.input';
import { StoryFilterInput } from './story-filter.input';

@InputType()
export class UpdateStoryDataInput extends CreateStoryDataInput {}

@InputType()
export class UpdateStoryInput {
  @Field()
  data: UpdateStoryDataInput;

  @Field()
  filter: StoryFilterInput;
}
