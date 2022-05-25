import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, MaxLength } from 'class-validator';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MaxLength(64)
  title: string;

  @Field()
  @MaxLength(4096)
  content: string;

  @Field(() => ID, { nullable: true })
  parent?: number;

  @Field(() => [String], { nullable: true })
  @MaxLength(16, {
    each: true,
  })
  @ArrayMaxSize(5)
  tags?: string[];

  @Field(() => ID, { nullable: true })
  forest?: number;

  author: number;
  root: number;
  level: number;
}
@InputType()
export class CreateStoryInput {
  @Field(() => CreateStoryDataInput)
  data: CreateStoryDataInput;
}
