import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTagDataInput {
  @Field()
  @MinLength(1)
  @MaxLength(63)
  readonly label: string;

  slug: string;
}
@InputType()
export class CreateTagInput {
  @Field()
  data: CreateTagDataInput;
}
