import { Field, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, MaxLength } from 'class-validator';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@InputType()
export class CreateStoryDataInput {
  @Field()
  @MaxLength(64)
  title: string;

  @Field()
  @MaxLength(4096)
  content: string;

  @Field(() => HashedIDScalar, { nullable: true })
  parent?: number;

  @Field(() => [String], { nullable: true })
  @MaxLength(16, {
    each: true,
  })
  @ArrayMaxSize(5)
  tags?: string[];

  @Field(() => HashedIDScalar, { nullable: true })
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
