import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DislikeStoryInput {
  @Field()
  story: string;
}

@InputType()
export class DislikeCommentInput {
  @Field()
  comment: string;
}

@InputType()
export class DislikeAuthorInput {
  @Field()
  author: string;
}
