import { Field, ObjectType } from '@nestjs/graphql';
import { Membership } from '../membership.entity';

@ObjectType()
export class JoinPayload {
  @Field(() => Membership, { nullable: true })
  membership?: Membership | null;
}
