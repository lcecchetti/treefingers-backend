import { Field, ObjectType } from '@nestjs/graphql';
import { Followership } from '../followership.entity';

@ObjectType()
export class FollowPayload {
  @Field(() => Followership, { nullable: true })
  readonly followership?: Followership | null;
}
