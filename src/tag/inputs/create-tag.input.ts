import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
class CreateTagDataInput {
  @Field()
  @MinLength(1)
  @MaxLength(63)
  readonly label: string;
}
@InputType()
export class CreateTagInput {
  @Field(() => CreateTagDataInput)
  data: CreateTagDataInput;
}
