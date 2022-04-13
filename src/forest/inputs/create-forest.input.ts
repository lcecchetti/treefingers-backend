import { Field, InputType } from '@nestjs/graphql';
import { Length, Matches } from 'class-validator';

@InputType()
export class CreateForestDataInput {
  @Field()
  @Length(1, 32)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  readonly name: string;

  @Field()
  @Length(1, 512)
  readonly about: string;

  founder: string;
}
@InputType()
export class CreateForestInput {
  @Field(() => CreateForestDataInput)
  data: CreateForestDataInput;
}
