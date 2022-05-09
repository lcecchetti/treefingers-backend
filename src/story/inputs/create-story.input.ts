import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, MaxLength } from 'class-validator';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MaxLength(64)
  readonly title: string;

  @Field()
  @MaxLength(4096)
  readonly content: string;

  @Field(() => ID, { nullable: true })
  readonly parent?: string;

  @Field(() => [String], { nullable: true })
  @MaxLength(16, {
    each: true,
  })
  @ArrayMaxSize(5)
  readonly tags?: string[];

  @Field(() => ID, { nullable: true })
  forest?: string;

  author: string;
}
@InputType()
export class CreateStoryInput {
  @Field(() => CreateStoryDataInput)
  data: CreateStoryDataInput;
}
