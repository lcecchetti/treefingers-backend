import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@ObjectType()
export class LikePayload {
  @Field(() => Like, { nullable: true })
  readonly like?: Like | null;
}
