import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { EncodedID } from '../../common/scalars/encoded-id.scalar';
import { EditStoryDataInput } from './edit-story.input';

@InputType()
export class CreateStoryDataInput extends EditStoryDataInput {
  @Field(() => EncodedID, { nullable: true })
  parent?: number;

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
