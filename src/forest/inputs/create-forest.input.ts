import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
class CreateForestDataInput {
  @Field()
  @Length(1, 63)
  readonly name: string;

  @Field()
  @Length(1, 512)
  readonly about: string;
}
@InputType()
export class CreateForestInput {
  @Field(() => CreateForestDataInput)
  data: CreateForestDataInput;
}
