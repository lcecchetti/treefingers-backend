import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { StoryFilterInput } from './story-filter.input';

@InputType()
@ArgsType()
export class StoryInput {
  @Field(() => StoryFilterInput, { nullable: true })
  filter?: StoryFilterInput = new StoryFilterInput();
}
