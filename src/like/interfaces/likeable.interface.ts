import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@InterfaceType()
export abstract class Likeable {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  likesCount: number;

  @Field(() => Like, { nullable: true })
  currentUserLike: Like;
}
