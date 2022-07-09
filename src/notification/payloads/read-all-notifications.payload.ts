import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReadAllNotificationsPayload {
  @Field(() => Int)
  readonly count: number;
}
