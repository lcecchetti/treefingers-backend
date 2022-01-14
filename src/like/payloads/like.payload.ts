import { Field, ObjectType } from '@nestjs/graphql';
import { Like } from '../like.entity';

@ObjectType({ isAbstract: true })
class LikePayload {
  @Field(() => Like)
  readonly like: Like;
}

@ObjectType()
export class LikeStoryPayload extends LikePayload {}

@ObjectType()
export class LikeCommentPayload extends LikePayload {}

@ObjectType()
export class LikeAuthorPayload extends LikePayload {}
