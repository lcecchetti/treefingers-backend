import { ObjectType } from '@nestjs/graphql';
import { FollowPayload } from './follow.payload';

@ObjectType()
export class UnfollowPayload extends FollowPayload {}
