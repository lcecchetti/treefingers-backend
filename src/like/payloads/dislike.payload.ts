import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@ObjectType({ isAbstract: true })
export class DislikePayload {
  @Field(() => Like, { nullable: true })
  readonly like?: Like;
}
