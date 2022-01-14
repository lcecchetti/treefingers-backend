import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { CreateCommentDataInput } from 'src/comment/inputs/create-comment.input';

@InputType()
export class CreateTagDataInput {
  @Field()
  @MinLength(1)
  @MaxLength(63)
  readonly label: string;
}
@InputType()
export class CreateTagInput {
  @Field(() => CreateCommentDataInput)
  data: CreateTagDataInput;
}
