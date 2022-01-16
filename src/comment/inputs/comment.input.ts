import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CommentDataInput {
  @Field()
  @MaxLength(255)
  readonly content: string;
}

@InputType()
export class CommentInput {
  @Field(() => CommentDataInput)
  data: CommentDataInput;
}
