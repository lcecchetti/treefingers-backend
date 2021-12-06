import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@ObjectType()
export class CreateLikePayload {
  @Field(() => Like)
  readonly like: Like;
}
