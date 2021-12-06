import { Field, ID, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateStoryInput {
  @Field()
  @MaxLength(255)
  readonly title: string;

  @Field()
  @MaxLength(1023)
  readonly content: string;

  @Field(() => ID, { nullable: true })
  readonly root?: string;

  @Field(() => ID, { nullable: true })
  readonly parent?: string;

  author?: string;
}
