import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DislikeStoryInput {
  @Field(() => ID)
  story: string;
}
