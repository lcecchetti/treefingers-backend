import { ObjectType } from '@nestjs/graphql';
import { CommentPayload } from './comment.payload';

@ObjectType()
export class CommentStoryPayload extends CommentPayload {}
