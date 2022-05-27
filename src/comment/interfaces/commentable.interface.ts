import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';

@InterfaceType()
export abstract class Commentable {
  @Field(() => HashedIDScalar)
  id: number;

  @Field(() => Int)
  commentsCount: number;
}
