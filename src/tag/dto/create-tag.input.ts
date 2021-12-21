import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

//@todo define naming convention: tagInputData o tagDataInput
@InputType()
export class CreateTagInputData {
  @Field()
  @MinLength(1)
  @MaxLength(63)
  readonly label: string;

  slug: string;
}

@InputType()
@ArgsType()
export class CreateTagInput {
  @Field()
  data: CreateTagInputData;
}
