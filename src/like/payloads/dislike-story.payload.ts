import { ObjectType } from '@nestjs/graphql';
import { DislikePayload } from './dislike.payload';

@ObjectType()
export class DislikeStoryPayload extends DislikePayload {}
