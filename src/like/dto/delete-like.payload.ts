import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteLikePayload {
  @Field(() => Int)
  readonly deletedCount: number;
}
