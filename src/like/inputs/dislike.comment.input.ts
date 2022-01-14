import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DislikeCommentInput {
  @Field(() => ID)
  comment: string;
}
