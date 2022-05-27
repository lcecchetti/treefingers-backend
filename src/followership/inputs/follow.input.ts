import { Field, InputType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InputType()
export class FollowInput {
  @Field(() => EncodedID)
  followed: number;

  follower: number;
}
