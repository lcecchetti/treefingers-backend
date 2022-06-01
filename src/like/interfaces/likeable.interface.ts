import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { EncodedID } from '../../common/scalars/encoded-id.scalar';
import { Like } from '../like.entity';

@InterfaceType()
export abstract class Likeable {
  @Field(() => EncodedID)
  id: number;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;
}
