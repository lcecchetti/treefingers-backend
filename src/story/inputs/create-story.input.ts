import { Field, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, MaxLength } from 'class-validator';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MaxLength(64)
  title: string;

  @Field()
  @MaxLength(4096)
  content: string;

  @Field(() => EncodedID, { nullable: true })
  parent?: number;

  @Field(() => [String], { nullable: true })
  @MaxLength(16, {
    each: true,
  })
  @ArrayMaxSize(5)
  tags?: string[];

  @Field(() => EncodedID, { nullable: true })
  forest?: number;

  author: number;
  path: number[];
  root: number;
}
@InputType()
export class CreateStoryInput {
  @Field(() => CreateStoryDataInput)
  data: CreateStoryDataInput;
}
