import { ObjectType } from '@nestjs/graphql';
import { LikePayload } from './like.payload';

@ObjectType()
export class LikeStoryPayload extends LikePayload {}
