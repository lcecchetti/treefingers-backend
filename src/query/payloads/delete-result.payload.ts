import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteResultPayload {
  @Field(() => Int, { nullable: true })
  readonly deletedCount?: number;
}
