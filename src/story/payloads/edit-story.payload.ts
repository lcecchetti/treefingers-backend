import { Field, ObjectType } from '@nestjs/graphql';
import { Story } from '../story.entity';

@ObjectType()
export class EditStoryPayload {
  @Field(() => Story)
  readonly story: Story;
}
