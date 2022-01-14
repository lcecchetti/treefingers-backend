import { Field, ObjectType } from '@nestjs/graphql';
import { DeleteResultPayload } from 'src/query/payloads/delete-result.payload';
import { Like } from '../like.entity';

@ObjectType({ isAbstract: true })
class DislikePayload {
  @Field(() => Like, { nullable: true })
  readonly like?: Like;

  @Field(() => DeleteResultPayload, { nullable: true })
  readonly result?: DeleteResultPayload;
}

@ObjectType()
export class DislikeStoryPayload extends DislikePayload {}

@ObjectType()
export class DislikeCommentPayload extends DislikePayload {}

@ObjectType()
export class DislikeAuthorPayload extends DislikePayload {}
