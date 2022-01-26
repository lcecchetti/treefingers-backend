import { ObjectType } from '@nestjs/graphql';
import { LikePayload } from './like.payload';

@ObjectType()
export class LikeForestPayload extends LikePayload {}
