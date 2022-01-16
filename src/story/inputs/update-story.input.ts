import { Field, InputType } from '@nestjs/graphql';
import { CreateStoryDataInput } from './create-story.input';
import { FilterStoryInput } from './filter-story.input';

@InputType()
export class UpdateStoryDataInput extends CreateStoryDataInput {}

@InputType()
export class UpdateStoryInput {
  @Field(() => UpdateStoryDataInput)
  data: UpdateStoryDataInput;

  @Field(() => FilterStoryInput)
  filter: FilterStoryInput;
}
