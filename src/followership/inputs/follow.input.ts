import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FollowInput {
  @Field(() => ID)
  user: string;
}
