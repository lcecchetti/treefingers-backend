import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MaxLength(300)
  readonly title: string;

  @Field()
  @MaxLength(4096)
  readonly content: string;

  @Field(() => ID, { nullable: true })
  readonly parent?: string;

  @Field(() => [String], { nullable: true })
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
