import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateStoryPayload {
  @Field(() => Int)
  modifiedCount: number;
}
