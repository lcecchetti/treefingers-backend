import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @MaxLength(255)
  readonly content: string;

  @Field(() => ID)
  readonly story: string;

  user?: string;
}
