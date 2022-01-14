import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MinLength(1)
  @MaxLength(255)
  readonly title: string;

  @Field()
  @MinLength(1)
  @MaxLength(1023)
  readonly content: string;

  @Field(() => ID, { nullable: true })
  readonly root?: string;

  @Field(() => ID, { nullable: true })
  readonly parent?: string;

  author?: string;
}
@InputType()
export class CreateStoryInput {
  @Field(() => CreateStoryDataInput)
  data: CreateStoryDataInput;
}
