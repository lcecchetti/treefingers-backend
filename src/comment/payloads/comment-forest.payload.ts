import { ObjectType } from '@nestjs/graphql';
import { CommentPayload } from './comment.payload';

@ObjectType()
export class CommentForestPayload extends CommentPayload {}
