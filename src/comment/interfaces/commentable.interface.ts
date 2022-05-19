import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class Commentable {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  commentsCount: number;
}
