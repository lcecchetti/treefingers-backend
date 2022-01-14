import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class DislikeAuthorInput {
  @Field(() => ID)
  author: string;
}
