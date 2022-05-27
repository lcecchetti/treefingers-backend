import { Field, InputType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@InputType()
export class JoinInput {
  @Field(() => HashedIDScalar)
  forest: number;

  member: number;
}
