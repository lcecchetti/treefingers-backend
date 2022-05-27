import { Field, InputType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@InputType()
export class FollowInput {
  @Field(() => HashedIDScalar)
  followed: number;

  follower: number;
}
