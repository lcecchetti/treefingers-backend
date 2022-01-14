import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class LikeCommentInput {
  @Field(() => ID)
  comment: string;
}
