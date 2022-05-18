import { Field, InputType } from '@nestjs/graphql';
import { Matches, MaxLength } from 'class-validator';

@InputType()
export class CreateForestDataInput {
  @Field()
  @MaxLength(21)
  @Matches(/^[a-zA-Z0-9-_]+$/)
  name: string;

  @Field()
  @MaxLength(4096)
  about: string;

  founderId: number;
}
@InputType()
export class CreateForestInput {
  @Field(() => CreateForestDataInput)
  data: CreateForestDataInput;
}
