import { InputType, ArgsType, Field } from '@nestjs/graphql';
import { ConnectionInput } from 'src/pagination/dto/connection.input';
import { StoryFilterInput } from 'src/story/dto/story-filter.input';

@InputType()
@ArgsType()
export class StoriesInput extends ConnectionInput {
  @Field(() => StoryFilterInput, { nullable: true })
  filter?: StoryFilterInput = new StoryFilterInput();
}
