import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class LikeAuthorInput {
  @Field(() => ID)
  author: string;
}
