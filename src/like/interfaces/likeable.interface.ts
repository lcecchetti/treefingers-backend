import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { HashedIDScalar } from 'src/common/scalars/hashed-id.scalar';
import { Like } from '../like.entity';

@InterfaceType()
export abstract class Likeable {
  @Field(() => HashedIDScalar)
  id: number;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;
}
