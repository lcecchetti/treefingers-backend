import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateCommentDataInput {
  @Field()
  @MaxLength(255)
  readonly content: string;

  @Field(() => ID)
  readonly story: string;
}
@InputType()
export class CreateCommentInput {
  @Field()
  data: CreateCommentDataInput;
}
