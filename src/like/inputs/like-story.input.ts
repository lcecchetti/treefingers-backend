import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class LikeStoryInput {
  @Field(() => ID)
  story: string;
}
