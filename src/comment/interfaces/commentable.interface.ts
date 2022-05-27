import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { EncodedID } from 'src/common/scalars/encoded-id.scalar';

@InterfaceType()
export abstract class Commentable {
  @Field(() => EncodedID)
  id: number;

  @Field(() => Int)
  commentsCount: number;
}
