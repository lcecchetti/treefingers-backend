import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateResultPayload {
  @Field(() => Int, { nullable: true })
  readonly modifiedCount?: number;
}
