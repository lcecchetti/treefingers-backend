import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FollowInput {
  @Field(() => ID)
  followedId: number;

  followerId: number;
}
