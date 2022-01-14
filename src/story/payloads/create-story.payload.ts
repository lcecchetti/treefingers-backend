import { Field, ObjectType } from '@nestjs/graphql';
import { Story } from '../story.entity';

@ObjectType()
export class CreateStoryPayload {
  @Field(() => Story)
  readonly story: Story;
}
