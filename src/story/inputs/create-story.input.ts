import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EncodedID } from '../../common/scalars/encoded-id.scalar';

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
  @MinLength(2, {
    each: true,
  })
  @Matches(/^[a-zA-Z0-9_]*$/g, { each: true })
  @ArrayMaxSize(5)
  @ArrayUnique()
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
  @ValidateNested()
  @Type(() => CreateStoryDataInput)
  data: CreateStoryDataInput;
}
