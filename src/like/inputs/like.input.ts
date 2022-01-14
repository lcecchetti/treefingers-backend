import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class LikeInput {
  user?: string;
}

@InputType()
export class LikeStoryInput extends LikeInput {
  @Field(() => ID)
  story: string;
}

@InputType()
export class LikeCommentInput extends LikeInput {
  @Field(() => ID)
  comment: string;
}

@InputType()
export class LikeAuthorInput extends LikeInput {
  @Field(() => ID)
  author: string;
}
