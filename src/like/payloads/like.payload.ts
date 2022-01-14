import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@ObjectType({ isAbstract: true })
export abstract class LikePayload {
  @Field(() => Like, { nullable: true })
  readonly like?: Like;
}
