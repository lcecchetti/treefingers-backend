import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserPayload {
  @Field(() => Int)
  modifiedCount: number;
}
