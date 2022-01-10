import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateCommentPayload {
  @Field(() => Int)
  modifiedCount: number;
}
